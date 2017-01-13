/*
  DEPRECATED - UNABLE TO REQUEST DATA FROM HERE...
*/


var QuizContainer = React.createClass({
  getInitialState: function () {
    return {
      currentStep: 0,
      completed: false,
      answers: {},
      quizData: {
        quiz: {
          title: "undefined"
        },
        questions: [
          {title: "example"}
        ],
        user: {
          id: 1
        }
      }
    }
  },
  updateProgress: function () {
    this.setState({ currentStep: (this.state.currentStep + 1) });
    console.log("Update", this.state.currentStep);
    if (this.state.currentStep == 1) { console.log("Load Analytics"); }
    if (this.state.currentStep == 4) { console.log("Send Data"); }

    $('input').attr('checked', false);
    $('.boxy').removeClass('correct');
    $('#progress_bar').progress('increment');
  },
  componentDidMount: function () {
    this.serverRequest = $.get(this.props.source, function (result) {
      // console.log("R", this.props.source, result);
      this.setState({
        quizData: result
      });
      $('#progress_bar').progress({
        showActivity: false,
        total: 1 + (this.state.quizData.questions.length * 2)
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    this.serverRequest.abort();
  },
  render: function () {
    return (
      <div className="ui large">
        <div className="ui tall stacked segment">
          <QuizProgress phase={this.state.currentStep} quizTitle={this.state.quizData.quiz.title} />
          <QuizUI phase={this.state.currentStep} quizData={this.state.quizData} onUpdate={this.updateProgress} />
        </div>
      </div>
    )
  }
});

// Progress Bar
var QuizProgress = React.createClass({
  render: function () {
    var progress = "";
    var num = 0;
    if (this.props.phase == 0) {
      progress = <span>Overview</span>
    } else if (this.props.phase == 11) {
      progress = <span>Conclusion</span>
    } else if (this.props.phase > 11) {
      progress = <span>Review</span>
    } else if ((this.props.phase % 2) == 1) { // Is Question
      num = Math.ceil(this.props.phase / 2);
      progress = <span>Question #{num}</span>
    } else if ((this.props.phase % 2) == 0) { // Is Answer
      num = this.props.phase / 2;
      progress = <span>Answer #{num}</span>
    }
    // <div className="ui top left attached label">{this.props.quizTitle}: {progress} </div>
    return (
      <div>
        <h3>{this.props.quizTitle}</h3>
        <div id="progress_bar" className="ui green progress">
          <div className="bar">
            <div className="progress"></div>
          </div>
        </div>
      </div>
    )
  }
});

// // Bottom Part
// var QuizControls = React.createClass({
//   render: function () {
//     var buttonOne = "";
//     if (this.props.phase == 0) {
//       buttonOne = "Get Started";
//     } else if (this.props.phase == 11) {
//       buttonOne = "Finish";
//     } else if (this.props.phase > 11) {
//       buttonOne = "Review";
//     } else if ((this.props.phase % 2) == 1) {
//       buttonOne = "Submit Answer";
//     } else if ((this.props.phase % 2) == 0) {
//       buttonOne = "Next Question";
//     }
//     return (
//       <button className="ui green button" onClick={this.props.onUpdate}>
//         {buttonOne}
//       </button>
//     )
//   }
// });
//
// var QuestionText = React.createClass({
//   onAnsClick: function (event) {
//     $('input').attr('checked', false);
//     $('.boxy').removeClass('correct');
//     $(event.currentTarget).find('input').attr('checked', true);
//     $(event.currentTarget).addClass('correct');
//   },
//   // stopProp: function (event) {
//   //   event.stopPropagation();
//   //   event.preventDefault();
//   // },
//   render: function () {
//     return (
//       <div className="field">
//         <div className="ui radio checkbox boxy" onClick={this.onAnsClick}>
//           <input hidden name="example2" type="radio" />
//           <label>{this.props.response}</label>
//         </div>
//       </div>
//     )
//   }
// });
//
// var AnswerText = React.createClass({
//   render: function () {
//     return (
//       <div className="field">
//         <div className={"ui boxy " + (this.props.correct ? "correct" : "") }>
//           {this.props.response} | {this.props.nums}%
//         </div>
//       </div>
//     )
//   }
// });

// State container for quiz.
var QuizUI = React.createClass({
  getInitialState: function () {
    return {
      ansSelected: false
    };
  },
  componentDidMount: function () {
    console.log("Q", this.props.quizData.questions.length);
    // console.log(this.props.phase);
    var url = "/url/quiz/getQuestion" + this.props.quizData.questions[this.props.phase].id;
    console.log(url);
    // this.serverRequest = $.get("/api/quiz/getQuestions", function (result) {
    //   // console.log("R", this.props.source, result);
    //   this.setState({
    //     quizData: result
    //   });
    //   $('#progress_bar').progress({
    //     showActivity: false,
    //     // total: 1 + (this.state.quizData.questions.length * 2)
    //   });
    // }.bind(this));
  },
  render: function () {
    var headerText = "";
    var rows = [];
    var minorText = "";
    var showRem = false;
    var info = {};
    var qNum = Math.ceil(this.props.phase / 2) - 1;

    if (this.props.phase == 0) {
      headerText = this.props.quizData.quiz.topic;
      minorText = "By: " + this.props.quizData.quiz.author;
    } else if (this.props.phase == 11) {
      headerText = "Finish";
      minorText = "All Done!";
    } else if (this.props.phase > 11) {
      headerText = "Review";
    } else if ((this.props.phase % 2) == 1) {
      // Question ========================================================
      headerText = this.props.quizData.questions[qNum][0].question;
      for (var i = 0; i < this.props.quizData.questions[qNum].length; i++) {
        rows.push(<AnswerLine key={i} response={this.props.quizData.questions[qNum][i].responseText} correct={null} nums={null} />);
      }
      // var responses = JSON.parse(this.props.quizData.questions[qNum].responses);
      // for (var i = 0; i < responses.length; i++) {
      //   if (responses[i] === "") { continue; }
      //   rows.push(<AnswerLine key={i} response={responses[i]} correct={null} nums={null} />);
      // }
    } else if ((this.props.phase % 2) == 0) {
      // Answer ==========================================================
      headerText = this.props.quizData.questions[qNum][0].question;
      var responses = this.props.quizData.questions[qNum].map(function (elem, indx) { return elem.responseText; });
      var correct = this.props.quizData.questions[qNum].map(function (elem, indx) { return elem.correct; });
      // var correct = JSON.parse(this.props.quizData.questions[qNum].correct);

      // Remediation Info
      showRem = true;
      info.rating = this.props.quizData.questions[qNum][0].avg_rating;
      info.topic = this.props.quizData.questions[qNum][0].tag;
      info.explaination = this.props.quizData.questions[qNum][0].remediation;

      // Stats
      // var stats = JSON.parse(this.props.quizData.questions[qNum].stats);
      // var total = stats.reduce(function (prev, curr) { return prev + curr; });
      // stats = stats.map(function (elem) { return Math.round(elem/total * 100); });
      var stats = new Array(this.props.quizData.questions[qNum].length).fill(10);

      // Make rows.
      for (var i = 0; i < responses.length; i++) {
        if (responses[i] === "") { continue; }
        rows.push(<AnswerLine key={i} response={responses[i]} correct={correct[i]} nums={stats[i]}  />);
      }
    }

    return (
      // This all gets translated by JSX pre-compiler to plain JS, is optional.
      <div className="QuizUI">
        <h3>{headerText}</h3>
        <p>{minorText}</p>
        <div className="ui form">
          <div className="grouped fields allQuestions">
            {rows}
          </div>
        </div>
        <RemediationArea showRem={showRem} info={info} />
        <Controls phase={this.props.phase} onUpdate={this.props.onUpdate} />
      </div>
    );
  }
});

// Used for rendering questions and answers.
var AnswerLine = React.createClass({
  onAnsClick: function (event) {
    $('input').attr('checked', false);
    $('.boxy').removeClass('correct');
    $(event.currentTarget).find('input').attr('checked', true);
    $(event.currentTarget).addClass('correct');
  },
  render: function () {
    if (this.props.nums) {
      return (
        <div className="fluid field">
          <div className={"ui radio checkbox boxy " + (this.props.correct ? "correct" : "") }>
            <input hidden name="selectedAnswer" type="radio" />
            <label>{this.props.response}</label>
            <span className="stats">
              {this.props.nums}%
            </span>
          </div>

        </div>
      )
    } else {
      return (
        <div className="fluid field">
          <div className="ui radio checkbox boxy hoverable" onClick={this.onAnsClick}>
            <input hidden name="selectedAnswer" type="radio" />
            <label>{this.props.response}</label>
          </div>
        </div>
      )
    }

  }
});

// Displays rating, topic and remediation for answer screen.
var RemediationArea = React.createClass({
  render: function () {
    if (this.props.showRem) {
      return (
        <div>
          <div className="ui message explaination">
            <div className="header">Explaination</div>
            <p>{this.props.info.explaination}</p>
          </div>
          <div className="stat_holder">
            <div className="ui label">
              <i className="star icon"></i>{this.props.info.rating}
            </div>
            <div className="ui tag label">{this.props.info.topic}</div>
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
});

// Changes button text based on phase and if answer selected.
// Also updates the phase when button clicked.
var Controls = React.createClass({
  render: function () {
    var buttonOne = "";
    var tooFar = this.props.phase > 12;
    if (this.props.phase == 0) {
      buttonOne = "Get Started";
    } else if (this.props.phase == 11) {
      buttonOne = "Finish";
    } else if (this.props.phase > 11) {
      buttonOne = "Review";
    } else if ((this.props.phase % 2) == 1) {
      buttonOne = "Submit Answer";
    } else if ((this.props.phase % 2) == 0) {
      buttonOne = "Next Question";
    }
    return (
      <button className={"ui green button " + (tooFar ? "hideMe" : "")} onClick={this.props.onUpdate}>
        {buttonOne}
      </button>
    )
  }
});

ReactDOM.render(
  <QuizContainer source="/api/quiz/{{data.quiz.id}}"/>, // This is also JSX.
  document.getElementById('container')
);
