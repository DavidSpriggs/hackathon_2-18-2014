/* global _, Backbone, app:true */

(function() {
  'use strict';

  app = app || {};

  app.Activity = Backbone.Model.extend({
    defaults: {
      title: 'title',
      time: null,
      attendees: []
    }
  });

  app.ActivityView = Backbone.View.extend({
    el: '#activityGrid',
    template: _.template( $('#tmpl-activity').html() ),
    events: {
      'submit form': 'preventSubmit',
      'click .btn-success': 'attend'
    },
    initialize: function() {

      // query activities
      require(['esri/tasks/QueryTask', 'esri/tasks/query'], function(QueryTask, Query) {
        var query = new Query();

      });


      this.model = new app.Contact();
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('[name="name"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    attend: function() {
      console.log('attend');

      // add row to attendee table

      // this.model.save({
      //   name: this.$el.find('[name="name"]').val(),
      //   email: this.$el.find('[name="email"]').val(),
      //   message: this.$el.find('[name="message"]').val()
      // });
    }
  });

  $(document).ready(function() {
    app.activityView = new app.ActivityView();
  });
}());
