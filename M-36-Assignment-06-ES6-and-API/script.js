const noPost = document.getElementById("no-post");
const readCount = document.getElementById("read-count");

// count total post read
let count = 0;

document.addEventListener("DOMContentLoaded", function () {
  // Select the container where you want to render the API data
  const apiContainer = document.querySelector(".api-container");
  const loadingWrapper = document.getElementById("loadingWrapper");
  const latestLoadingWrapper = document.getElementById("latestLoadingWrapper");
  const contentWrapper = document.getElementById("contentWrapper");
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  let posts;

  function fetchAndRenderPostsResult(categoryName = "") {
    // Declare the posts array in a wider scope

    // Fetch data from the API with a delay of 2000 milliseconds (2 seconds)
    setTimeout(() => {
      fetch(
        `https://openapi.programming-hero.com/api/retro-forum/posts?category=${categoryName}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Hide the loading wrapper and show the content wrapper
          loadingWrapper.style.display = "none";
          contentWrapper.style.display = "flex";
          // Clear the contentWrapper before appending new content
          contentWrapper.innerHTML = "";
          posts = data.posts;
          if (posts.length === 0) {
            // Create a new p element
            const newParagraph = document.createElement("h1");

            // Set the content of the p element
            newParagraph.textContent = `No posts available based on this search: ${categoryName}`;
            // Add styles to the paragraph
            newParagraph.style.textAlign = "center"; // Adjust as needed
            newParagraph.style.fontSize = "24px";
            newParagraph.style.fontWeight = "bold";

            // Append the p element under the contentWrapper div
            contentWrapper.appendChild(newParagraph);
          }

          if (posts.length > 0) {
            // Remove the loading spinner
            apiContainer.innerHTML = "";

            // Render API data dynamically for each post
            posts.forEach((post, index) => {
              const apiContent = `
        <div class="box-border border border-solid border-primary rounded-2xl bg-[#797DFC1A] bg-opacity-10 p-6 mb-8">
          <div class="flex items-start">
            <div class="relative rounded-xl bg-white border border-solid border-gray-300 p-4 lg:w-[62px] w-0 h-0 lg:h-[62px] m-0">
              <div class="absolute top-0 right-[-3px] h-4 w-4 ${
                post.isActive === true ? "bg-[#10B981]" : "bg-red-500"
              } rounded-full"></div>
            </div>
            <div class="lg:w-[670px] w-[285px]">
              <div class="flex">
                <p class="mx-4"># ${post.category}</p>
                <p>Author: ${post.author.name}</p>
              </div>
              <div class="card-body p-4">
                <div class="border-dashed border-b-2 pb-6 border-[#03071233]">
                  <h2 class="card-title">${post.title}</h2>
                  <p>${post.description}</p>
                </div>

                <div class="flex justify-between mt-2">
                  <div class="flex items-center gap-2">
                    <!-- Message Icon with Count -->
                    <div class="flex lg:gap-4 gap-0">
                      <i class="fa fa-envelope-o text-gray-500 text-xl"></i>
                      <span class="text-[#12132D99] px-2 text-xl">${
                        post.comment_count
                      }</span>
                    </div>

                    <!-- Eye Icon with Count -->
                    <div class="flex lg:gap-4 gap-0">
                      <i class="fa fa-eye text-gray-500 text-xl"></i>
                      <span class="text-[#12132D99] px-2 text-xl">${
                        post.view_count
                      }</span>
                    </div>

                    <!-- Clock Icon with Minutes -->
                    <div class="flex lg:gap-4 gap-0">
                      <i class="fa fa-clock-o text-gray-500 text-xl"></i>
                      <span class="text-[#12132D99] px-2 text-xl">${
                        post.posted_time
                      }</span>
                    </div>
                  </div>

                    <div class="bg-[#10B981] cursor-pointer rounded-full w-8 h-8 flex items-center justify-center envelope-icon" data-index="${index}">
                        <i class="fa fa-envelope-open-o text-white"></i>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

              // Append the API content to the container
              apiContainer.innerHTML += apiContent;
            });
            document
              .querySelectorAll(".envelope-icon")
              .forEach((envelopeIcon, index) => {
                envelopeIcon.addEventListener("click", () => {
                  handleEnvelopeClick(index);
                });
              });
          }
        })
        .catch((error) => {
          loadingWrapper.style.display = "none";
          // Handle errors, e.g., display an error message
          apiContainer.innerHTML =
            '<p class="error-message">Error fetching data from the API</p>';
          showAlert("Error fetching data from the API", "error");
        });
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

  // called this post api initial load
  fetchAndRenderPostsResult();

  searchButton.addEventListener("click", () => {
    // Get the category name from the search input
    const categoryName = searchInput.value.trim();
    loadingWrapper.style.display = "block";
    contentWrapper.style.display = "none";

    // Check if the category name is not empty
    if (categoryName) {
      // Call the fetchAndRenderPosts function with the provided category name
      fetchAndRenderPostsResult(categoryName);
    } else {
      fetchAndRenderPostsResult();

      // Display an error message or handle the case where the category name is empty
      showAlert("Category name cannot be empty", "error");
    }
  });

  const postDetails = document.getElementById("postDetails");

  function handleEnvelopeClick(index) {
    const clickedPost = posts[index];
    count++;

    if (count > 0) {
      noPost.style.display = "none";
    }

    readCount.innerHTML = `Mark as read (${count})`;

    // Create a new div element
    const newDiv = document.createElement("div");
    newDiv.classList.add(
      "flex",
      "justify-between",
      "rounded-xl",
      "bg-white",
      "p-4",
      "mb-4"
    );

    newDiv.innerHTML = `
      <p>${clickedPost.title}</p>
      <div class="flex lg:gap-2 gap-0 items-center">
        <i class="fa fa-eye text-gray-500 text-xl"></i>
        <span class="text-[#12132D99] px-2 text-xl">${clickedPost.view_count}</span>
        <button class="delete-btn text-red-500" onclick="handleDeleteClick(this)">Delete</button>
      </div>
    `;

    // Append the new div to the existing content
    postDetails.appendChild(newDiv);
  }

  const latestPostsContainer = document.getElementById("latestPostsContainer");

  // Add a delay of 2000 milliseconds (2 seconds)
  setTimeout(() => {
    // Fetch data from the latest posts API
    fetch("https://openapi.programming-hero.com/api/retro-forum/latest-posts")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const latestPosts = data;
          latestLoadingWrapper.style.display = "none";
          latestPostsContainer.style.display = "flex";
          // Display three posts per row
          for (let i = 0; i < latestPosts.length; i += 3) {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add(
              "flex",
              "flex-col",
              "lg:flex-row",
              "lg:justify-between",
              "mt-6",
              "gap-8"
            );

            for (let j = i; j < i + 3 && j < latestPosts.length; j++) {
              const post = latestPosts[j];

              const cardDiv = document.createElement("div");
              cardDiv.classList.add(
                "card",
                "card-compact",
                "lg:w-96",
                "w-[23rem]",
                "bg-base-100",
                "shadow-xl"
              );
              let postDate =
                post.author.posted_date !== undefined
                  ? post.author.posted_date
                  : "No publish date";

              let authorDesignation =
                post.author.designation !== undefined
                  ? post.author.designation
                  : "Unknown";

              cardDiv.innerHTML = `
                  <figure>
                    <img src="${post.cover_image}" alt="${post.title}" class="p-4 rounded-[2rem]"/>
                  </figure>
                  <div class="card-body">
                    <i class="fa fa-calendar-check-o"> ${postDate}</i>
                    <h2 class="card-title">${post.title}</h2>
                    <p class="text-[#12132D99]">${post.description}</p>
                    <div class="flex items-center space-x-4">
                      <!-- Rounded Image -->
                      <div class="w-12 h-12 overflow-hidden rounded-full">
                        <img src="${post.profile_image}" alt="${post.author.name}" class="w-full h-full object-cover"/>
                      </div>
                      <!-- Title and Description Container -->
                      <div>
                        <h3 class="text-lg font-semibold">${post.author.name}</h3>
                        <p class="text-gray-600">${authorDesignation}</p>
                      </div>
                    </div>
                  </div>
                `;

              rowDiv.appendChild(cardDiv);
            }

            latestPostsContainer.appendChild(rowDiv);
          }
        } else {
          showAlert(
            "Error: Unexpected response format from the latest posts API",
            "error"
          );
        }
      })
      .catch((error) => {
        showAlert("Error fetching latest posts:", "error");
      });
  }, 2000); // 2000 milliseconds (2 seconds) delay
});

function handleDeleteClick(button) {
  // Get the parent div of the clicked button and remove it
  const postDiv = button.closest(".rounded-xl");
  postDetails.removeChild(postDiv);

  // Update the count and display message if needed
  count--;
  readCount.innerHTML = `Mark as read (${count})`;
  if (count === 0) {
    noPost.style.display = "block";
  }
}

function showAlert(message, toastType = "") {
  var toastEnd = document.getElementById("toast-end");
  const alert = document.getElementById("alert");

  // Remove both classes initially
  alert.classList.remove("alert-error", "alert-success");

  // Add the appropriate class based on toastType
  if (toastType === "success") {
    alert.classList.add("alert-success");
  } else {
    alert.classList.add("alert-error");
  }

  toastEnd.classList.remove("hidden");
  document.getElementById("toast-message").textContent = message;

  setTimeout(function () {
    toastEnd.classList.add("hidden");
  }, 3000); // 3000 milliseconds (3 seconds)
}
