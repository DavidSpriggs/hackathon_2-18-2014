/* global _, Backbone, app:true */

(function() {
  'use strict';

  require(['esri/tasks/QueryTask',
    'esri/tasks/query',
    'esri/tasks/StatisticDefinition',
    'dojo/_base/lang'
  ], function(QueryTask, Query, StatisticDefinition, lang) {

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
      template: _.template($('#tmpl-event').html()),
      events: {
        'submit form': 'preventSubmit',
        'click .btn-success': 'attend'
      },

      users: [{
        name: 'Andrew',
        avatar: 'https://2.gravatar.com/avatar/a25421f6c79d5f381fab65c82abf85e8?d=https%3A%2F%2Fidenticons.github.com%2F3f67fd97162d20e6fe27748b5b372509.png&r=x&s=32'
      }, {
        name: 'AL',
        avatar: 'https://1.gravatar.com/avatar/fe330c3cb09248e16d65ec74d1455a5f?d=https%3A%2F%2Fidenticons.github.com%2Faccf9b1ac769272fd9720ca5d85bb1ba.png&r=x&s=32'
      }, {
        name: 'Julie',
        avatar: 'https://2.gravatar.com/avatar/e95ec66e340beccf9b9c76ba7102e27a?d=https%3A%2F%2Fidenticons.github.com%2F1950d625a1d7cb7ffc8ac2d496c4174d.png&r=x&s=32'
      }, {
        name: 'Tom',
        avatar: 'https://0.gravatar.com/avatar/b7ba58abd7dba707a1df4fc9f2b50af8?d=https%3A%2F%2Fidenticons.github.com%2Fed5e3348d8061480ee9e57659512cea6.png&r=x&s=32'
      }],

      initialize: function() {
        this.TRACKING_URL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/3';
        this.ACTIVITY_URL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/1';
        this.EVENTS_URL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/0';
        var activityIds;
        var query = new Query();

        query.where = '1=1';
        query.outFields = ['*'];

        var queryTask = new QueryTask(this.EVENTS_URL);

        queryTask.execute(query, lang.hitch(this, function(features) {
          this.activities = features;
          this.render();
        }), function(err) {
          console.log(err);
        });
      },
      render: function() {
        // var item;

        // _.each(this.activities.features, lang.hitch(this, function(activity) {
        //   item = this.template({
        //     info: activity.attributes
        //   });
        //   this.$el.append(item);
        // }));
        // 
        var item;

        _.each(this.activities.features, lang.hitch(this, function(activity, i) {
          if (i % 2 === 0) {
            activity.attributes.SHORT = 4;

            item = this.template({
              info: activity.attributes,
              friends: this.users
            });
          } else {
            activity.attributes.SHORT = 2;
            item = this.template({
              info: activity.attributes,
              friends: [this.users[2], this.users[3]]
            });
          }
          this.$el.append(item);
        }));

      },
      preventSubmit: function(event) {
        event.preventDefault();
      },
      setActivities: function(activities) {
        console.log(activities);

        var activityIds = [];

        _.each(activities.features, lang.hitch(this, function(activity) {
          activityIds.push(activity.attributes.ACTIVITY_ID);
        }));

        var query = new Query();

        query.where = 'ACTIVITYID IN (' + activityIds.join(', ') + ')';
        query.outFields = ['*'];

        var queryTask = new QueryTask(this.ACTIVITY_URL);

        queryTask.execute(query, lang.hitch(this, function(features) {
          console.log(features);
          this.activities = features;
          this.render();
        }), function(err) {
          console.log(err);
        });


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
  });
}());