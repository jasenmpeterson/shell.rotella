let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      totalQuestions: null
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
    }
  },
  computed: {
    reverseItems() {
      return app.questions.reverse();
    }
  }
});
