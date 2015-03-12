var templates = {};
var tocViews = [];
var linkViews = [];
var pageViews = [];

var PageModel = Backbone.Model.extend({

	defaults: {
	    page: 0,
	    title: "",
	    content: "",
	    links: {
		    pageLink: 0,
		    sentence: ""
		}
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
    "": "showTOC",
    "page/:pageNumber": "showPage",
  },

  showTOC: function() {
	  

	}

});/*
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

  showPage: function(page) {
    $.ajax({
      url: "/api/page/" + page,
      method: "GET",
      success: function(data) {
      	$("#tocContainer").html("");
      	linkViews = [];
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

var LinkModel = Backbone.Model.extend({

	defaults: {
    page: 0,
    sentence: ""
  	},

  viewDetails: function() {
    var details = this.toJSON();
    return details;
  },

});

var LinkView = Backbone.View.extend({

  tagName: "div",

  className: "links",

  initialize: function(model) {
  	this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.linkInfo(this.model.viewDetails()));
  },

});

var PageTOCModel = Backbone.Model.extend({

	defaults: {
    page: 0,
    title: ""
  	},

  viewDetails: function() {
    var details = this.toJSON();
    return details;
  },

});

var PageTOCView = Backbone.View.extend({

  tagName: "div",

  initialize: function(model) {
  	this.model = model;
    this.render();
  },

  render: function() {
    this.$el.html(templates.tocInfo(this.model.viewDetails()));
  },

});
*/
var getTemplates = function(){

	var pageString = $("#page-template").text()
  	templates.pageInfo = Handlebars.compile(pageString);


  /*var tocString = $("#toc-template").text()
  templates.tocInfo = Handlebars.compile(tocString);

  var linkString = $("#link-template").text()
  templates.linkInfo = Handlebars.compile(linkString);*/

};

var PageModel = Backbone.Model.extend({

	defaults: {
	    page: 0,
	    title: "",
	    content: "",
	    links: {
		    pageLink: 0,
		    sentence: ""
		}
  	},

  viewDetails: function() {
    var details = this.toJSON();
    return details;
  },

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
var pageCollecion = new PageCollection;
var router = new Router;

var populateDataBase = function() {
	

	var testModel = new PageModel({
				    page: 5,
				    title: "One",
				    content: "first test model",
				    links: {
					    pageLink: 4,
					    sentence: "yep"
					}
		  		  });

	var testModel2 = new PageModel({
				    page: 5,
				    title: "Two",
				    content: "second test model",
				    links: {
					    pageLink: 4,
					    sentence: "yep"
					}
		  		  });

	var testModel3 = new PageModel({
				    page: 5,
				    title: "Three",
				    content: "third test model",
				    links: {
					    pageLink: 4,
					    sentence: "yep"
					}
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
		    	_.each(pageCollecion.models, function(element){	
	  				pageViews.push(new PageView(element));
	  			})

	  			_.each(pageViews, function(element){
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