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
      initialize: function() {
        this.TRACKING_URL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/3';
        this.ACTIVITY_URL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/1';
        this.EVENTS_URL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/0';
        var activityIds;
        var query = new Query(),
          statisticDefinition = new StatisticDefinition();

        statisticDefinition.onStatisticField = 'PLAN_ATTEND';
        statisticDefinition.outStatisticFieldName = 'Participation';
        statisticDefinition.statisticType = 'sum';

        query.where = '1=1';
        query.outStatistics = [statisticDefinition];
        query.groupByFieldsForStatistics = ['ACTIVITY_ID'];

        var queryTask = new QueryTask(this.TRACKING_URL);

        queryTask.execute(query, lang.hitch(this, function(features) {
          this.setActivities(features);
        }), function(err) {
          console.log(err);
        });
      },
      render: function() {
        var item;

        _.each(this.activities.features, lang.hitch(this, function(activity) {
          item = this.template({
            info: activity.attributes
          });
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