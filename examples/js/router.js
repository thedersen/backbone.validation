var Router = Backbone.Router.extend({

  routes: {
    '': 'index',
    'onblur': 'onblur'
  },

  index: function() {
    this._render(new BasicView({ model: new BasicModel() }));
  },
  onblur: function() {
    this._render(new OnBlurView({ model: new BasicModel() }));
  },

  _render: function(view){
    if(this.currentView){
      Backbone.Validation.unbind(view);
      this.currentView.remove();
    }
    this.currentView = view;
    $('#example').html(view.render().el);
  }

});

$(function(){
  new Router();
  Backbone.history.start({root: '/projects/backbone-validation/examples/'});
});