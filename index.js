"use strict";

console.log("this is a message from the AMD module, version 1.0.3");
while (typeof React === "undefined" || React === null) {
  console.log("React is not available. Waiting 100ms and trying again.");
  await sleep(100);
}
const garblegarble = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return garblegarble(
      "button",
      { onClick: () => this.setState({ liked: true }) },
      "Like"
    );
  }
}

const domContainer = document.querySelector("#like_button_container");
ReactDOM.render(garblegarble(LikeButton), domContainer);
