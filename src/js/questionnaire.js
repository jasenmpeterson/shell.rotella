let app = new Vue({
  el: "#app",
  data: {
    questions: null,
    questionIndex: 0
  },
  created: function () {
    axios
      .get("http://shell.rotella.ellpreview.com/questions")
      .then(function (response) {
        app.questions = response;
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
  }
});
