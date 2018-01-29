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
      questionAnswered: false
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

      if (this.answers.length) {
        this.questionIndex++;
        this.currentProducts = [];
        this.currentProduct = null;
      } else {
        this.modalPopUp("Please make a selection before proceeding.");
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
    },
    optionSelected: function (event) {

      // has question been answered?

      if (!this.questionAnswered) {
        // the data-attribute is used to reference the index of the question being answered
        var index = event.target.parentNode.dataset.id;
        event.target.parentNode.classList.add("active");

        // push selections to array for reference
        app.answers.push({
          questionIndex: app.questionIndex,
          question_weight: event.target.parentNode.dataset.weight,
          answer: event.target.parentNode.dataset.answer,
          recommendations: (this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations !== null ? this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations : null)
        });

        // filter the suggested lubricants list
        this.filterRecommendations();

        var multipleChoice = this.questions[this.questionIndex].acf.question.multiple_choice;

        // if it isn't a multiple choice question then set answered to true - ie. only one item can be selected at a time.

        if (multipleChoice !== "Yes") {
          this.questionAnswered = true;
        }

      }

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
