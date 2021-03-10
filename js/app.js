let vm = new Vue({
  el: '#vue-app',
  data: {
    columns: ['model'],  
    categories: [],
    selectedCategories: [],
    sortKey: '',                  
    models: []
  },
  mounted: function() {
    var self = this
    $.getJSON('data/data_ecore.json', function(json1) {
      self.models = json1;

      $.getJSON('data/data_uml.json', function(json2) {
        self.models.push.apply(self.models, json2)

        self.models.map(function(model) {
          category = self.getCategory(model);
          if(category != undefined && category != "") {
            if (!self.categories.includes(category)) {
              self.categories.push(category);
            }
          }
        });
        self.categories.sort();
      });

    });  

  },
  computed: {
    listToShow : function() {
      var self = this;

      var filtered = self.models.filter(function(model) {
        modelCategory = self.getCategory(model);
        for(i in self.selectedCategories) {
          if(self.selectedCategories[i] == modelCategory) {
           return true;
          }
        }
        return false;
      });

      return filtered;
    }
  },
  created: function() {
    var self = this;
    // $('.collapse').collapse('show');
  },
  methods: {
    sortBy: function(sortKey) {
      this.sortKey = sortKey;
    },
    getCategory: function(model) {
      if (model.metadata != undefined && "category" in model.metadata) {
        return model.metadata.category[0];
      }
      else return undefined;
    },
    toggleCategory: function(category) {
      var self = this
      if(self.selectedCategories.indexOf(category) == -1) {
        self.selectedCategories.push(category)
      } else {
        self.selectedCategories = self.selectedCategories.filter(function(value, index, arr){
          return value != category;
        });
      }
    }
  }
})
