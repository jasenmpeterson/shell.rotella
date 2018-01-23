let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      answers: new Array(),
      questionName: null
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
      console.log(app.questions);
      console.log(app.questionIndex);
    },
    prev: function () {
      this.questionIndex--;
    },
    optionSelected: function (event) {
      app.answers.push({
        questionIndex: app.questionIndex,
        answer: event.target.dataset.answer,
        answer_weight: event.target.dataset.weight
      })
      // search for specified key in array populated by objects.
      function search(key, myArray) {
        for (let i = 0; i < myArray.length; i++) {
          if (myArray[i].questionIndex === key) {
            console.log(myArray[i]);
          }
        }
      }
      search(app.questionIndex, app.answers);
    }
  },
  computed: {
    reverseItems() {
      return app.questions.reverse();
    }
  }
});
