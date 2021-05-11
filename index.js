(async function () {
  while (typeof React === "undefined" || React === null) {
    console.log("React is not available. Waiting 100ms and trying again.");
    await sleep(100);
  }

  const useState = React.useState;

  const e = React.createElement;

  function getHeaders() {
    return {
      "Content-Type": "application/json",
      Origin: window.location.origin,
      "Ghost-Member-Id": Evergreen.memberId,
      "Ghost-Jwt": "foobar123", // TODO: Get this from API
    };
  }

  async function makeGetRequest(url = "") {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: getHeaders(),
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  // TODO: Refactor for more reuse between this and POST equivalent
  async function makeDeleteRequest(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
        "Ghost-Member-Id": Evergreen.memberId, // TODO: get this server-side
        "Ghost-Jwt": "foobar123", // TODO: Get this from API
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function makePatchRequest(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "PATCH", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
        "Ghost-Member-Id": Evergreen.memberId, // TODO: get this server-side
        "Ghost-Jwt": "foobar123", // TODO: Get this from API
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  // Example POST method implementation pulled from MDN docs
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
  async function makePostRequest(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
        "Ghost-Member-Id": Evergreen.memberId,
        "Ghost-Jwt": "foobar123", // TODO: Get this from API
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const EvergreenComments = ({ postId }) => {
    const [inputValue, setInputValue] = useState("");
    const [postData, setPostData] = useState(() => {
      fetchPostData();
      return null;
    });
    const [commentsSaving, setCommentsSaving] = useState([]);
    const [commentEditing, setCommentEditing] = useState(null);
    const [editedText, setEditedText] = useState("");

    function fetchPostData() {
      return makeGetRequest(
        `${Evergreen.baseUrl}/api/ghost/post/${Evergreen.contentId}/`
      ).then((res) => {
        console.log("Post Data", res);
        setPostData(res);
      });
    }

    console.log("postData state var:", postData);

    function addComment(commentText) {
      if (commentText === "") {
        return;
      }
      makePostRequest(
        `${Evergreen.baseUrl}/api/ghost/post/${Evergreen.contentId}/comment/`,
        {
          comment_text: commentText,
          ghost_jwt: JSON.stringify({ fake: "jwt" }), // TODO: replace w/ real JWT from Ghost's /members/api/session/ endpoint
          member_id: Evergreen.memberId,
          username: "example user",
        }
      ).then((res) => {
        setInputValue("");
        setPostData(res);
      });
    }

    function deleteComment(commentId) {
      setCommentsSaving((commentsSaving) => [...commentsSaving, commentId]);
      makeDeleteRequest(
        `${Evergreen.baseUrl}/api/ghost/post/${Evergreen.contentId}/comment/`,
        {
          comment_id: commentId,
          ghost_jwt: JSON.stringify({ fake: "jwt" }), // TODO: replace w/ real JWT from Ghost's /members/api/session/ endpoint
          member_id: Evergreen.memberId,
          username: "example user",
        }
      ).then((res) => {
        setCommentsSaving((commentsSaving) =>
          commentsSaving.filter((id) => id != commentId)
        );
        setPostData(res);
      });
    }

    function editComment(commentId, commentText) {
      setCommentsSaving((commentsSaving) => [...commentsSaving, commentId]);
      makePatchRequest(
        `${Evergreen.baseUrl}/api/ghost/post/${Evergreen.contentId}/comment/`,
        {
          comment_id: commentId,
          comment_text: commentText,
          ghost_jwt: JSON.stringify({ fake: "jwt" }), // TODO: replace w/ real JWT from Ghost's /members/api/session/ endpoint
          member_id: Evergreen.memberId,
          username: "example user",
        }
      ).then((res) => {
        setCommentsSaving((commentsSaving) =>
          commentsSaving.filter((id) => id != commentId)
        );
        setCommentEditing();
        setPostData(res);
      });
    }

    return (
      <div className="mx-20">
        {!postData ? (
          <span>Loading...</span>
        ) : (
          postData.post.comments.map((comment) => (
            <div key={comment.id}>
              <div>
                {comment.author.avatar_url ? (
                  <img src={comment.author.avatar_url} />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div>
                  <div>
                    <div>{comment.author.username}</div>
                    <div>{dayjs().to(comment.created_at)}</div>
                  </div>
                  {postData.member.id == comment.author.id ? (
                    commentsSaving.includes(comment.id) ? (
                      <div>Please wait...</div>
                    ) : (
                      <div>
                        <a
                          onClick={(e) => {
                            setEditedText(comment.text);
                            setCommentEditing(comment.id);
                          }}
                        >
                          Edit
                        </a>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            deleteComment(comment.id);
                          }}
                        >
                          Delete
                        </a>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
              <div>
                {commentEditing == comment.id ? (
                  <div>
                    <textarea
                      type="textarea"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        setCommentEditing();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        editComment(comment.id, editedText);
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <React.Fragment>{comment.text}</React.Fragment>
                )}
              </div>
            </div>
          ))
        )}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></input>
        <button
          onClick={() => {
            addComment(inputValue);
          }}
        >
          Post Comment
        </button>
      </div>
    );
  };

  const domContainer = document.querySelector("#evergreen-comments-container");
  ReactDOM.render(e(EvergreenComments), domContainer);
})();
