var templates = {};
var tocViews = [];
var linkViews = [];
var pageTOCViews = [];

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
    "edit/:pageNumber": "editPage"
  },

  displayIndex: function(){
    populateDataBase();
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
    var page = new PageView(dataModel);
    $("#container").html(page.$el);
  },

  editPage: function(page) {
    var dataModel = this.getSpecificPage(page);
    var pageEdit = new EditView(dataModel);
    $("#container").html(pageEdit.$el);
  }

});
/*
      success: function(data) {
        console.log(data);
    }

        _.each(data, function(element, index){
        	element = new PageTOCModel({
        		page: element.page,
        		title: element.title
        	});
        	tocViews.push(new PageTOCView(element));

        });

       _.each(tocViews, function(element, index){
    		$("#tocContainer").append(tocViews[index].el);
    	});

      },
    })
  },

  showPage: function() {
    $.ajax({
      url: "/api/page/" + page,
      method: "GET",
      success: function(data) {
      	$("#container").html("");
      	pageViews = [];
        console.log(data);

        _.each(data.paragraphs, function(element, index){
    		$("#tocContainer").append(element);
    	});

    	 _.each(data.links, function(element, index){
        	element = new LinkModel({
        		page: element.page,
        		sentence: element.sentence
        	});
        	linkViews.push(new LinkView(element));
        });


    	  _.each(linkViews, function(element, index){
    		$("#tocContainer").append(linkViews[index].el);
    	});


      },
    })
  },

});
  
*/
var getTemplates = function(){

	var pageTOCString = $("#page-toc-template").text()
  templates.pageTOCInfo = Handlebars.compile(pageTOCString);

  var pageString = $("#page-template").text()
  templates.pageInfo = Handlebars.compile(pageString);

  var editString = $("#edit-template").text()
  templates.editInfo = Handlebars.compile(editString);

};

var EditView =  Backbone.View.extend({

  tagName: "div",

  initialize: function(model) {
    this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.editInfo(this.model.viewDetails()));
  },

});

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

var populateDataBase = function() {
	

	var testModel = new PageModel({
				    page: 1,
				    title: "One",
				    content: "first test model",
				    links: [{
					    pageLink: 4,
					    sentence: "yep"
					    },
              {
              pageLink: 6,
              sentence: "second link"
            }]
		  		  });

	var testModel2 = new PageModel({
				    page: 2,
				    title: "Two",
				    content: "second test model",
				    links: [{
              pageLink: 4,
              sentence: "yep"
              },
              {
              pageLink: 6,
              sentence: "second link"
            }]
		  		  });

	var testModel3 = new PageModel({
				    page: 3,
				    title: "Three",
				    content: "third test model",
				    links: [{
              pageLink: 4,
              sentence: "yep"
              },
              {
              pageLink: 6,
              sentence: "second link"
            }]
		  		  });

		    	pageCollecion.create(testModel);
		    	pageCollecion.create(testModel2);
		    	pageCollecion.create(testModel3);
		    	console.log(pageCollecion);
}

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

	$("#populate").click(function() {
		populateDataBase();
	})

	$("#showTOC").click(function() {
		getInitialData(showTOC);

	})

   

});