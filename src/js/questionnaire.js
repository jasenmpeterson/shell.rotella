let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      products: new Array(),
      answers: new Array(),
      currentProduct: null,
      currentProducts: new Array(),
      questionAnswered: false,
      multipleChoice: false
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

      // make sure the question has been answered before proceeding

      if (this.questionAnswered) {
        this.questionIndex++;
        this.currentProducts = [];
        this.currentProduct = null;
        this.questionAnswered = false;
      } else {
        this.modalPopUp("Please select an answer before proceeding.");
      }

      if (app.questions.length === this.questionIndex) {
        this.quizComplete();
      } else if (app.questions.length !== this.questionIndex) {
        this.answers = [];
      }

      // let heading = document.querySelector(".title");
      // Splitting.chars(heading);

    },
    prev: function () {
      this.questionIndex--;
      var selectedAnswers = document.querySelectorAll(".answer.active");
      if (selectedAnswers.length) {
        this.questionAnswered = true;
      }
    },
    optionSelected: function (event) {

      // even target

      var target = event.target.parentNode;

      // even target id

      var index = target.dataset.id;

      // is question multiple choice?

      var multiple_choice = (this.questions[this.questionIndex].acf.question.multiple_choice === "Yes" ? true : false);

      // set selected answer to an active state, set questionAnswered to true

      if (target.classList.contains("active")) {

        target.classList.remove("active");

      } else {
        target.classList.add("active");
        this.questionAnswered = true;
      }

      // If there are no selected answers or if answers have been de-selected, set questionAnswered to false

      var selectedAnswers = document.querySelectorAll(".answer.active");

      if (!selectedAnswers.length) {
        this.questionAnswered = false;
      }

      // Push selected answer(s) to answers array

      app.answers.push({
        questionIndex: app.questionIndex,
        question_weight: target.dataset.weight,
        answer: target.dataset.answer,
        recommendations: (this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations !== null ? this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations : null)
      });

      this.filterRecommendations();

    },
    filterRecommendations: function () {
      var products = document.querySelectorAll(".product");
      // loop through answers which has recommendations object
      for (var value of this.answers) {
        // loop through recommendations and push the name to currentProducts array
        for (var recommendation of value.recommendations) {
          this.currentProducts.push(recommendation.post_title);
        }
      };
      // remove active states
      for (var product of products) {
        product.classList.remove("active");
      }
      // loop through currentProducts array and reapply active state to appropriate products
      for (this.currentProduct of this.currentProducts) {
        document.querySelector("[data-name='" + this.currentProduct + "'").classList.add("active");
      }
    },
    quizComplete: function () {
      console.log(this.answers);
    },
    modalPopUp: function (message) {
      let modal = document.querySelector(".modal-box");
      let modalText = document.querySelector(".modal-body");
      modalText.innerHTML = message;
      modal.classList.add("active");
    },
    closeModalPopUp: function () {
      let modal = document.querySelector(".modal-box");
      modal.classList.remove("active");
    }
  },
  computed: {
    reverseItems() {
      return app.questions.reverse();
    }
  }
});