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
      "Ghost-Jwt": "foobar123",
    };
  }
  async function makeGetRequest(url = "") {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: getHeaders(),
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return response.json();
  }
  async function makeDeleteRequest(url = "", data = {}) {
    const response = await fetch(url, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
        "Ghost-Member-Id": Evergreen.memberId,
        "Ghost-Jwt": "foobar123",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  }
  async function makePatchRequest(url = "", data = {}) {
    const response = await fetch(url, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
        "Ghost-Member-Id": Evergreen.memberId,
        "Ghost-Jwt": "foobar123",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
  }
  async function makePostRequest(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: window.location.origin,
        "Ghost-Member-Id": Evergreen.memberId,
        "Ghost-Jwt": "foobar123",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();
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
          ghost_jwt: JSON.stringify({ fake: "jwt" }),
          member_id: Evergreen.memberId,
          username: "example user",
        }
      ).then((res) => {
        setInputValue("");
        setPostData(res);
      });
    }
    function deleteComment(commentId) {
      setCommentsSaving((commentsSaving2) => [...commentsSaving2, commentId]);
      makeDeleteRequest(
        `${Evergreen.baseUrl}/api/ghost/post/${Evergreen.contentId}/comment/`,
        {
          comment_id: commentId,
          ghost_jwt: JSON.stringify({ fake: "jwt" }),
          member_id: Evergreen.memberId,
          username: "example user",
        }
      ).then((res) => {
        setCommentsSaving((commentsSaving2) =>
          commentsSaving2.filter((id) => id != commentId)
        );
        setPostData(res);
      });
    }
    function editComment(commentId, commentText) {
      setCommentsSaving((commentsSaving2) => [...commentsSaving2, commentId]);
      makePatchRequest(
        `${Evergreen.baseUrl}/api/ghost/post/${Evergreen.contentId}/comment/`,
        {
          comment_id: commentId,
          comment_text: commentText,
          ghost_jwt: JSON.stringify({ fake: "jwt" }),
          member_id: Evergreen.memberId,
          username: "example user",
        }
      ).then((res) => {
        setCommentsSaving((commentsSaving2) =>
          commentsSaving2.filter((id) => id != commentId)
        );
        setCommentEditing();
        setPostData(res);
      });
    }
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "mx-20",
        style: { display: "flex", flexDirection: "column" },
      },
      !postData
        ? /* @__PURE__ */ React.createElement("span", null, "Loading...")
        : postData.post.comments.map((comment) =>
            /* @__PURE__ */ React.createElement(
              "div",
              {
                key: comment.id,
                style: {
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "25px",
                  paddingLeft: "10px",
                  borderLeft: "2px solid #ccc",
                  padding: "10px",
                },
              },
              /* @__PURE__ */ React.createElement(
                "div",
                {
                  style: { display: "flex", flexDirection: "row" },
                },
                comment.author.avatar_url
                  ? /* @__PURE__ */ React.createElement("img", {
                      src: comment.author.avatar_url,
                      style: {
                        height: "36px",
                        width: "36px",
                        borderRadius: "10px",
                        backgroundColor: "#55efc4",
                      },
                    })
                  : /* @__PURE__ */ React.createElement(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                      },
                      /* @__PURE__ */ React.createElement("path", {
                        fillRule: "evenodd",
                        d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",
                        clipRule: "evenodd",
                      })
                    ),
                /* @__PURE__ */ React.createElement(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    },
                  },
                  /* @__PURE__ */ React.createElement(
                    "div",
                    {
                      style: { marginLeft: "10px" },
                    },
                    /* @__PURE__ */ React.createElement(
                      "div",
                      {
                        style: { fontWeight: "bold", color: "#555" },
                      },
                      comment.author.username
                    ),
                    /* @__PURE__ */ React.createElement(
                      "div",
                      {
                        style: { color: "#aaa" },
                      },
                      dayjs().to(comment.created_at)
                    )
                  ),
                  postData.member.id == comment.author.id
                    ? commentsSaving.includes(comment.id)
                      ? /* @__PURE__ */ React.createElement(
                          "div",
                          null,
                          "Please wait..."
                        )
                      : /* @__PURE__ */ React.createElement(
                          "div",
                          {
                            style: {
                              alignSelf: "flex-start",
                              marginLeft: "25px",
                              display: "flex",
                              cursor: "pointer",
                              color: "#CCC",
                            },
                          },
                          /* @__PURE__ */ React.createElement(
                            "a",
                            {
                              onClick: (e2) => {
                                setEditedText(comment.text);
                                setCommentEditing(comment.id);
                              },
                            },
                            "Edit"
                          ),
                          /* @__PURE__ */ React.createElement(
                            "a",
                            {
                              onClick: (e2) => {
                                e2.preventDefault();
                                deleteComment(comment.id);
                              },
                              style: {
                                marginLeft: "10px",
                                cursor: "pointer",
                              },
                            },
                            "Delete"
                          )
                        )
                    : null
                )
              ),
              /* @__PURE__ */ React.createElement(
                "div",
                {
                  style: {
                    marginTop: "5px",
                    width: "100%",
                  },
                },
                commentEditing == comment.id
                  ? /* @__PURE__ */ React.createElement(
                      "div",
                      null,
                      /* @__PURE__ */ React.createElement("textarea", {
                        type: "textarea",
                        value: editedText,
                        onChange: (e2) => setEditedText(e2.target.value),
                        style: {
                          width: "100%",
                          resize: "vertical",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          padding: "4px",
                          height: "auto",
                        },
                      }),
                      /* @__PURE__ */ React.createElement(
                        "button",
                        {
                          onClick: () => {
                            setCommentEditing();
                          },
                        },
                        "Cancel"
                      ),
                      /* @__PURE__ */ React.createElement(
                        "button",
                        {
                          onClick: () => {
                            editComment(comment.id, editedText);
                          },
                        },
                        "Save"
                      )
                    )
                  : /* @__PURE__ */ React.createElement(
                      React.Fragment,
                      null,
                      comment.text
                    )
              )
            )
          ),
      /* @__PURE__ */ React.createElement("input", {
        value: inputValue,
        onChange: (e2) => setInputValue(e2.target.value),
      }),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            addComment(inputValue);
          },
        },
        "Post Comment"
      )
    );
  };
  if (!Evergreen || !Evergreen.memberId) {
    return null;
  }
  const domContainer = document.querySelector("#evergreen-comments-container");
  ReactDOM.render(e(EvergreenComments), domContainer);
})();
