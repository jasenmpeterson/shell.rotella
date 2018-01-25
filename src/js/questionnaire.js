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
      var products = document.querySelectorAll(".product");
      var currentProducts = new Array();
      // loop through answers which has recommendations object
      for (var value of this.answers) {
        // loop through recommendations and push the name to currentProducts array
        for (var recommendation of value.recommendations) {
          currentProducts.push(recommendation.post_title);
        }
        // loop through currentProducts array
        for (var currentProduct of currentProducts) {
          // loop through products list and any found elements via the data-name attribute are set to active
          for (var product of products) {
            document.querySelector("[data-name='" + currentProduct + "'").classList.add("active");
          }
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
