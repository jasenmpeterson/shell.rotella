let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      products: new Array(),
      productsStatic: new Array(),
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
        app.productsStatic = products.data;
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
      var index = event.target.parentNode.dataset.id;
      event.target.parentNode.classList.add("active");
      app.answers.push({
        questionIndex: app.questionIndex,
        question_weight: event.target.parentNode.dataset.weight,
        answer: event.target.parentNode.dataset.answer,
        recommendations: this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations
      })
      this.filterRecommendations();
    },
    filterRecommendations: function () {
      for (var value of this.answers) {
        for (var recommendation of value.recommendations) {
          document.querySelector("[data-name='" + recommendation.post_title + "']").classList.add("active");
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
