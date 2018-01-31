let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      products: new Array(),
      answers: new Array(),
      currentRecommendations: new Array(),
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

      // event target

      var target = event.target.parentNode;

      // event name

      var targetName = event.target.parentNode.dataset.answer;

      // event target id

      var index = target.dataset.id;

      // is question multiple choice?

      var multiple_choice = (this.questions[this.questionIndex].acf.question.multiple_choice === "Yes" ? true : false);

      // set selected answer to an active state, set questionAnswered to true

      if (target.classList.contains("active")) {

        target.classList.remove("active");

        this.updateFilter(targetName);

      } else {

        target.classList.add("active");
        this.questionAnswered = true;

        // Push selected answer(s) to answers array

        app.answers.push({
          questionIndex: app.questionIndex,
          question_weight: target.dataset.weight,
          answer: target.dataset.answer,
          recommendations: (this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations !== null ? this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations : null)
        });


        this.filterRecommendations(target.dataset.answer);

      }

      // If there are no selected answers or if answers have been de-selected, set questionAnswered to false

      var selectedAnswers = document.querySelectorAll(".answer.active");

      if (!selectedAnswers.length) {

        this.questionAnswered = false;

      }

    },
    filterRecommendations: function (eventTarget) {

      var products = document.querySelectorAll(".product");

      // loop through answers which has a recommendations object

      for (var value of this.answers) {

        // loop through recommendations and push the name to currentProducts array


        for (var recommendation of value.recommendations) {
          this.currentRecommendations.push({
            answer: value.answer,
            recommendation: recommendation.post_title
          });
        }

      };

      // remove active states

      for (var product of products) {
        product.classList.remove("active");
      }

      // loop through currentProducts array and reapply active state to appropriate products

      var currentRecommendation = null;

      for (currentRecommendation of this.currentRecommendations) {
        var currentNode = document.querySelector("[data-name='" + currentRecommendation.recommendation + "']");
        currentNode.classList.add("active");
      }

    },
    updateFilter: function (product) {

      // Thank you!!!! -- https://stackoverflow.com/a/16100446
      // var arrayOfObjects = [{ a: 1, aa: "two" }];
      // var elementPos = arrayOfObjects.map(function (x) { return x.a; }).indexOf(1);
      // var objectFound = arrayOfObjects[elementPos];

      // search for recommended product in currentRecommendations array

      var elementPos = this.currentRecommendations.map(function (x) { return x.answer; }).indexOf(product);
      var objectFound = this.currentRecommendations[elementPos];

      // remove active state from recommended product node

      var currentNode = document.querySelector("[data-name='" + objectFound.recommendation + "']");
      currentNode.classList.remove("active");

      // filter through the currentRecommendations object and return only objects that DO NOT have the specified value

      let newCurrentRecommendationObject = this.currentRecommendations.filter(function (item) {
        return item.recommendation !== objectFound.recommendation;
      });

      // update recommdended product filter

      this.currentRecommendations = newCurrentRecommendationObject;

      // filter through answers object and return only objects that DO NOT have the specified value


      let newAnswerObject = this.answers.filter(function (item) {
        return item.answer !== objectFound.answer;
      });

      // update answers object

      this.answers = newAnswerObject;


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
      modal.classList.remove("active")
    }
  },
  computed: {
    reverseItems() {
      return app.questions.reverse();
    }
  }
});