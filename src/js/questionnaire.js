let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      answers: new Array(),
      completedQuiz: new Array()
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
      if (app.questions.length === this.questionIndex) {
        this.quizComplete();
      }
    },
    prev: function () {
      this.questionIndex--;
    },
    optionSelected: function (event) {
      app.answers.push({
        questionIndex: app.questionIndex,
        question_weight: event.target.dataset.weight,
        answer: event.target.dataset.answer,
        correct_answer: event.target.dataset.correct
      })
    },
    search: function (key, myArray) {
      for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].correct_answer === "True") {
          this.completedQuiz.push({
            answer: myArray[i].answer,
            question_weight: myArray[i].question_weight
          })
        }
      }
    },
    quizComplete: function () {
      this.search("correct_answer", app.answers)
    }
  },
  computed: {
    reverseItems() {
      return app.questions.reverse();
    }
  }
});
