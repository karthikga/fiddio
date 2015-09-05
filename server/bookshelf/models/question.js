var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');
require('./tag');
require('./questiontag');

var Question = db.Model.extend({
  tableName: 'questions',
  hasTimestamps: true,
  defaults: {
    star_count: 0,
    closed: false,
    response_count: 0,
    code: '',
    title: '',
    body: ''
  },
  owner: function() {
    return this.belongsTo('User');
  },
  solution: function() {
    return this.hasOne('Response', 'solution');
  },
  isClosed: function() {
    return this.get('closed');
  },
  tags: function() {
    return this.hasMany('Tag').through('QuestionTag');
  },
  responses: function() {
    return this.hasMany('Response');
  },
  changeStars: function(upOrDown) {
    this.set('star_count', this.get('star_count') + upOrDown);
    return this.save();
  },
  stars: function() {
    return this.hasMany('Star').through('Stars').withPivot('active');
  },
  markSolution: function(responseId) {
    this.set('solution', responseId);
    return this.save();
  },
  addResponse: function() {
    this.set('response_count', this.get('response_count')+1);
    return this.save();
  }
}, {
  fetchQuestionbyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true
    });
  },
  // fetchQuestion: function(short_url) {
  //   return new this({
  //     short_url: short_url
  //   }).fetch({
  //     require: true
  //   });
  // },
  newQuestion: function(options) {
    return new this(options);
  },
  changeStarsbyId: function(questionId, upOrDown) {
    return db.model('Question')
    .fetchQuestionbyId(questionId)
    .then(function(Question) {
      question.set('star_count', question.get('star_count') + upOrDown);
      return question.save();
    });
  }
});

module.exports = db.model('Question', Question);