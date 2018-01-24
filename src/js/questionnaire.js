let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      products: new Array(),
      answers: new Array(),
      completedQuiz: new Array(),
      recommendations: new Array()
    }
  },
  created: function () {
    axios
      .all([
        axios.get("http://rotella.api.ellpreview.com/wp-json/wp/v2/question"),
        axios.get("http://rotella.api.ellpreview.com/wp-json/wp/v2/products")
      ])
      .then(axios.spread((questions, products) => {
        app.questions = questions.data;
        app.totalQuestions = questions.data.length;
        app.products = products.data;
      }))
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
      var index = event.target.dataset.id
      console.log(this.questionIndex);
      app.answers.push({
        questionIndex: app.questionIndex,
        question_weight: event.target.dataset.weight,
        answer: event.target.dataset.answer,
        recommendations: this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations
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
