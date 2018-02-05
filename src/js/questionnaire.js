let app = new Vue({
  el: "#app",
  data() {
    return {
      questions: null,
      questionIndex: 0,
      products: [],
      answers: [],
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
      // TODO: LOGIC FOR SINGLE ANSWER AND MULTIPLE CHOICE QUESTIONS.

      if (this.questionAnswered) {
        this.questionAnswered = false;
        this.questionIndex++;
      } else {
        this.modalPopUp("Please select an answer before proceeding.");
      }

      // if last question...

      if (app.questions.length === this.questionIndex) {
        this.quizComplete();
      }

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

      var multipleChoice = (this.questions[this.questionIndex].acf.question.multiple_choice === "Yes" ? this.multipleChoice = true : this.multipleChoice = false);

      // set selected answer to an active state, set questionAnswered to true

      if (target.classList.contains("active")) {

        target.classList.remove("active");

        this.questionAnswered = false;

        this.updateFilter(targetName);

      } else {

        target.classList.add("active");

        this.questionAnswered = true;

        // Push selected answer(s) to answers array

        if (this.questions[this.questionIndex].acf.question.answers[index]) {

          if (!multipleChoice && !this.questionAnswered) {
            app.answers.push({
              questionIndex: app.questionIndex,
              id: target.dataset.id,
              question_weight: target.dataset.weight,
              answer: target.dataset.answer,
              recommendations: (this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations !== null ? this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations : null)
            });
          } else {
            app.answers.push({
              questionIndex: app.questionIndex,
              id: target.dataset.id,
              question_weight: target.dataset.weight,
              answer: target.dataset.answer,
              recommendations: (this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations !== null ? this.questions[this.questionIndex].acf.question.answers[index].answer.recommendations : null)
            });
          }

        }

        this.filterRecommendations();

      }

      var selectedAnswers = document.querySelectorAll(".answer.active");

      if (!selectedAnswers.length) {

        this.questionAnswered = false;

      }

    },
    filterRecommendations: function () {

      for (let obj of this.answers) {
        for (let recommendation of obj.recommendations) {
          document.querySelector("[data-name='" + recommendation.post_title + "'").classList.add("active");
        }
      };

    },
    updateFilter: function (product) {

      for (let obj of this.answers) {
        if (obj.answer === product) {
          for (let recommendation of obj.recommendations) {
            document.querySelector("[data-name='" + recommendation.post_title + "'").classList.remove("active");
          }
        }
      };

      let updatedFilter = this.answers.filter(function (obj) {
        return obj.questionIndex !== app.questionIndex;
      });

      this.answers = updatedFilter;

      this.filterRecommendations();

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