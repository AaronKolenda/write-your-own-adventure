// Declare all the global variables

var templates = {};
var tocViews = [];
var pageTOCViews = [];
var page;

var PageModel = Backbone.Model.extend({

  defaults: {
      page: 0,
      title: "",
      content: "",
      links: []
    },

  viewDetails: function() {
    var details = this.toJSON();
    return details;
  },

});

var PageCollection = Backbone.Collection.extend({

	url: "/api/page/",

	model: PageModel

});

var PageView = Backbone.View.extend({

  tagName: "div",

  initialize: function(model) {
  	this.model = model;
    this.render();

  },

  render: function() {
    this.$el.html(templates.pageInfo(this.model.viewDetails()));
  },

});

var Router = Backbone.Router.extend({

  routes: {
    "": "displayIndex",
    "page/:pageNumber": "showPage",
    "edit/:pageNumber": "editPage",
    "add": "addPageRoute"
  },

  displayIndex: function(){
    getInitialData(showTOC);
  },

  getSpecificPage: function(page) {
    var pageNum = Number(page);
      var dataModel = _.find(pageCollecion.models, function(mod){
        if (mod.get('page') === pageNum) {
          return true;
        }
      });
      return dataModel;
  },

  showPage: function(page) {
    var dataModel = this.getSpecificPage(page);
    page = new PageView(dataModel);
    $("#container").html(page.$el);
  },

  editPage: function(page) {
    var dataModel = this.getSpecificPage(page);
    var pageEdit = new EditView(dataModel);
    $("#container").html(pageEdit.$el);
  },

  addPageRoute: function() {
    var dataModel = new PageModel({
      page: pageCollecion.length + 1,
      title: "",
      content: "",
      links: []
    });
   var newPageView = new AddView(dataModel);
   pageCollecion.add(dataModel);
   $("#container").html(newPageView.$el);
  }


});

var redirectTOC = function() {router.navigate("", { trigger: true })}

var getTemplates = function(){

	var pageTOCString = $("#page-toc-template").text()
  templates.pageTOCInfo = Handlebars.compile(pageTOCString);

  var pageString = $("#page-template").text()
  templates.pageInfo = Handlebars.compile(pageString);

  var editString = $("#edit-template").text()
  templates.editInfo = Handlebars.compile(editString);

  var addString = $("#add-template").text()
  templates.addInfo = Handlebars.compile(addString);

};

// For editing a page

var EditView =  Backbone.View.extend({

  events: {
    "click .save": "savePage",
    "click .delete": "deletePage",
    "click .addLink": "addLink"
  },

  tagName: "div",

  initialize: function(model) {
    this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.editInfo(this.model.viewDetails()));
  },

  savePage: function() {
    var newTitle = $("#editTitle").val();
    var newContent = $("#editContent").val();
    var linksArray = this.model.get('links');

    _.each(linksArray, function(element){
      element.sentence = $("#editSentence" + element.pageLink).val();
      element.pageLink = $("#editLink" + element.pageLink).val();
    });

    var newLinkArray = _.filter(linksArray, function(element){
      if (element.sentence !== "" || element.pageLink !== "") {
        return true;
      }
    });
     this.model.set('links', newLinkArray);
                    
    this.model.set('title', newTitle);
    this.model.set('content', newContent);

    console.log(this.model);
    this.model.save({}, {
      success: function(data) {redirectTOC()}
    }
    );

  },

  // Something to add here would be shifting the other page numbers down once a page has been deleted
  // Right now if page 2 gets deleted, then 3 becomes 2, so adding a new page creates another page 3.

  deletePage: function() {
    page = "";
    this.model.destroy({
      success: function(data) {redirectTOC()}
    });
  },

});

// For adding a new page

var AddView =  Backbone.View.extend({

  events: {
    "click .create": "addPage",
     "click .addLink": "addLink"
  },

  tagName: "div",

  initialize: function(model) {
    this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.addInfo(this.model.viewDetails()));
  },

  addPage: function() {
    var newTitle = $("#addTitle").val();
    var newContent = $("#addContent").val();
    var linksArray = this.model.get('links');

    var i = 1;
    while (i < counter){
      var obj = {};
      obj.sentence = $("#addSentence" + i).val();
      obj.pageLink = $("#addLink" + i).val();
      linksArray.push(obj);
      i++;
    }

    this.model.set('links', linksArray);
    this.model.set('title', newTitle);
    this.model.set('content', newContent);

    console.log(this.model);
    this.model.save({}, {
      success: function(data) {redirectTOC()}
    });

  },

  // For adding additional links to each page

  addLink: function() {
    var htmlString = ('<div class="row center"><div class="cell columns2">Link to Page: <input type="text" id="addLink' + counter + '"/></div><div class="cell columns2">Link Text: <input type="text" id="addSentence' + counter + '"/></div></div>');
        $("#linkWrap").append(htmlString);
        counter++;
  }

});

var counter = 2;

// a View of each page on the Table of Contents

var PageTOCView = Backbone.View.extend({

  tagName: "div",

  initialize: function(model) {
  	this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.pageTOCInfo(this.model.viewDetails()));
  },

});

var pageCollecion = new PageCollection;
var router = new Router;

var getInitialData = function(callback) {

	pageCollecion.fetch({
  	success: function(data) {
  		console.log(pageCollecion)
  		callback();
  	},
	})	   
}

var showTOC = function() {
  $("#container").html("");
  pageTOCViews = [];
  console.log("in showTOC");
	_.each(pageCollecion.models, function(element){	
		pageTOCViews.push(new PageTOCView(element));
	})

	_.each(pageTOCViews, function(element){
		$("#container").append(element.$el);
	})
}

$(document).ready(function() {
	Backbone.history.start();
	getTemplates();
});