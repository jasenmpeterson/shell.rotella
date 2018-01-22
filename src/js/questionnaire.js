let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      selectedOptions: {},
      index: 0
    }
  },
  created: function () {
    axios
      .get("http://rotella.api.ellpreview.com/wp-json/wp/v2/question")
      .then(function (response) {
        app.questions = response.data;
        app.totalQuestions = response.data.length;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    next: function () {
      this.questionIndex++;
    },
    prev: function () {
      this.questionIndex--;
    },
    optionSelected: function (event) {
      console.log("clicked");
      app.selectedOptions[app.index++] = {
        answers: {
          selected: event.target.dataset.option
        }
      };
    }
  },
  computed: {
    reverseItems() {
      return app.questions.reverse();
    }
  }
});
