const searchInput = document.querySelector(".search");
const selectedValue = document.getElementById("selectByCategory");
const studentList = document.querySelector(".students-list");
const headForm = document.querySelector(".head-form");
const spinner = document.querySelector(".lds-roller");
const sortingByIcon = document.querySelectorAll("i");

const stat = {
  alldata: [],
  selectedSorting: "id",
  numericCategores: ["id", "Capsule", "age"],
  form: [],
  editPressed: false,
  toResetObj: {},
  isLoading: true,
};

const featchingData = async function (url) {
  try {
    const response = await fetch(url);
    const data = response.json();
    return data;
  } catch (e) {
    console.log(`ERROR -> ${e}`);
  }
};

const toggleLockInputs = function (arrOfSiblings, isLocked) {
  for (let i = 0; i < arrOfSiblings.length - 2; i++) {
    if (i !== 0) {
      arrOfSiblings[i].disabled = isLocked;
    }
  }
  if (!isLocked) arrOfSiblings[1].focus();
};
const resetStudentData = function (arrOfSiblings, resetobj) {
  let counter = 1;
  for (let prop in resetobj) {
    arrOfSiblings[counter].value = resetobj[prop];
    counter++;
  }
};

const updateData = function (parent) {
  const studentId = parent.id;
  const child = parent.children;
  for (let student of stat.alldata) {
    if (student.id === studentId) {
      student.firstName = child[1].value;
      student.lastName = child[2].value;
      student.capsule = child[3].value;
      student.age = child[4].value;
      student.city = child[5].value;
      student.gender = child[6].value;
      student.hobby = child[7].value;
    }
  }
};
const deleteData = function (e) {
  const parent = e.target.parentElement;

  for (let i = 0; i < stat.alldata.length; i++) {
    if (stat.alldata[i].id === parent.id) {
      stat.alldata.splice(i, 1);
      parent.remove();
      return;
    }
  }
};

const resetObj = function (siblings) {
  stat.toResetObj = {
    firstName: siblings[1].value,
    lastName: siblings[2].value,
    capsule: siblings[3].value,
    age: siblings[4].value,
    city: siblings[5].value,
    gender: siblings[6].value,
    hobby: siblings[7].value,
  };
};

const addCancelAndConfirmButtons = function (element) {
  element.target.textContent = "Cancel";
  element.target.classList.add("cancel");

  element.target.nextElementSibling.textContent = "Confirm";
  element.target.nextElementSibling.classList.add("confirm");
};
const removeCancelAndConfirmButtons = function (element) {
  element.target.textContent = "Edit";
  element.target.classList.remove("cancel");

  element.target.nextElementSibling.textContent = "Delete";
  element.target.nextElementSibling.classList.remove("confirm");
};
const removeCancelAndConfirmButtonsbyConfirm = function (element) {
  element.target.previousElementSibling.textContent = "Edit";
  element.target.previousElementSibling.classList.remove("cancel");

  element.target.textContent = "Delete";
  element.target.classList.remove("confirm");
};

const clickOnForm = function (element) {
  const siblings = element.target.parentElement.children;
  console.log(element.target.textContent);
  if (element.target.textContent === "Edit" && !stat.editPressed) {
    resetObj(siblings);
    stat.editPressed = true;
    addCancelAndConfirmButtons(element);

    toggleLockInputs(siblings, false);
  } else if (element.target.textContent === "Cancel") {
    stat.editPressed = false;
    removeCancelAndConfirmButtons(element);

    toggleLockInputs(siblings, true);
    resetStudentData(siblings, stat.toResetObj);
  } else if (element.target.textContent === "Confirm") {
    updateData(element.target.parentElement);
    removeCancelAndConfirmButtonsbyConfirm(element);
    stat.editPressed = false;
  } else if (element.target.textContent === "Delete") {
    deleteData(element);
  }
};

const actions = function (value) {
  searchInput.addEventListener("keyup", creatingATable);
  sortingByIcon.forEach((e) => {
    e.addEventListener("click", creatingATable);
  });

  [...headForm.children].forEach((m) => {
    m.addEventListener("click", creatingATable);

    stat.form.forEach((allforms) => {
      allforms.forEach((form) => {
        form.addEventListener("click", clickOnForm);
      });
    });
  });
};

const getStudents = async function () {
  const capsule1 = await featchingData(
    "https://capsules7.herokuapp.com/api/group/one"
  );
  const capsule2 = await featchingData(
    "https://capsules7.herokuapp.com/api/group/two"
  );
  const totalStudentsIdes = capsule1.concat(capsule2);
  const totalStudentsDesc = [];

  for (let i = 0; i < totalStudentsIdes.length; i++) {
    const dataFromId = featchingData(
      `https://capsules7.herokuapp.com/api/user/${totalStudentsIdes[i].id}`
    );
    totalStudentsDesc.push(dataFromId);
  }
  stat.alldata = await Promise.all(totalStudentsDesc);
  stat.isLoading = true;
  creatingATable();
  actions(searchInput.value);
};

const filterBy = function (property, sortedData) {
  if (property === "") return sortedData;
  return sortedData.filter((student) =>
    `${
      selectedValue.value === "Search by"
        ? student["firstName"]
        : student[selectedValue.value]
    }`.includes(property)
  );
};

const drawAStudentData = function (student) {
  const studentForm = `
  <div class='form' id="${student.id}">
  <label class='id' for="">${student.id}</label>
  <input class='firstName' disabled type="text" value="${student.firstName}">
  <input class='lastName' disabled type="text" value="${student.lastName}">
  <input class='capsule' disabled type="text" value="${student.capsule}">
  <input class='age' disabled type="text" value="${student.age}">
  <input class='city' disabled type="text" value="${student.city}">
  <input class='gender' disabled type="text" value="${student.gender}">
  <input class='hobby' disabled type="text" value="${student.hobby}">
  <button class='edit-btn'>Edit</button>
  <button class='remove-btn'>Delete</button>
</div>
`;
  studentList.innerHTML += studentForm;
};

const sortNumbers = function () {
  return stat.alldata.sort(
    (a, b) => a[stat.selectedSorting] - b[stat.selectedSorting]
  );
};

const sortStrings = function () {
  stat.alldata.sort((a, b) => {
    const nameA = a[stat.selectedSorting];
    const nameB = b[stat.selectedSorting];
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // if equal
  });
};
const hideSpinner = function (isLoading) {
  if (isLoading) {
    spinner.style.display = "none";
  } else {
    stat.isLoading = false;
  }
};
const creatingATable = function (e) {
  hideSpinner(stat.isLoading);
  stat.form = [];
  if (e) {
    if (e.target.textContent !== "")
      stat.selectedSorting = e.target.textContent;
    else stat.selectedSorting = e.target.parentElement.textContent;
  }
  if (stat.numericCategores.includes(stat.selectedSorting)) {
    sortNumbers();
  } else {
    sortStrings();
  }
  studentList.innerHTML = "";

  const arrayfilterd = filterBy(searchInput.value, stat.alldata);
  arrayfilterd.forEach((student) => {
    drawAStudentData(student);
  });

  stat.form.push(document.querySelectorAll(".form"));
  actions();
};

getStudents();
