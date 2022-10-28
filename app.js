const searchInput = document.querySelector(".search");
const selectedValue = document.getElementById("selectByCategory");
const studentList = document.querySelector(".students-list");
const headForm = document.querySelector(".head-form");

const students = {
  alldata: [],
  selectedSorting: "id",
  numericCategores: ["id", "Capsule", "age"],
  form: [],
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

const actions = function (value) {
  searchInput.addEventListener("keyup", creatingATable);

  [...headForm.children].forEach((m) => {
    m.addEventListener("click", creatingATable);
  });
  students.form.forEach((allforms) => {
    allforms.forEach((form) => {
      form.addEventListener("click", (element) => {
        console.log(form.getAttribute("id"));
        console.log(element);
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
  students.alldata = await Promise.all(totalStudentsDesc);

  creatingATable();
  actions(searchInput.value);
};

const filterBy = function (property, sortedData) {
  if (property === "") return sortedData;
  return sortedData.filter((student) =>
    `${student[selectedValue.value]}`.includes(property)
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
  //   const form = document.querySelector(".form");
  //   form.addEventListener("click", (e) => {
  //     e.preventDefault();
  //   });
  //   const deleteStudent = document.querySelector(".remove-btn");
  //   deleteStudent.addEventListener("click", (e) => {
  //     console.log(e);
  //   });
};

const sortNumbers = function () {
  return students.alldata.sort(
    (a, b) => a[students.selectedSorting] - b[students.selectedSorting]
  );
};

const sortStrings = function () {
  students.alldata.sort((a, b) => {
    const nameA = a[students.selectedSorting];
    const nameB = b[students.selectedSorting];
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // if equal
  });
};

const creatingATable = function (e) {
  if (e) {
    students.selectedSorting = e.target.textContent;
  }
  if (students.numericCategores.includes(students.selectedSorting)) {
    sortNumbers();
  } else {
    sortStrings();
  }
  studentList.innerHTML = "";

  const arrayfilterd = filterBy(searchInput.value, students.alldata);

  arrayfilterd.forEach((student) => {
    drawAStudentData(student);
  });
  students.form.push(document.querySelectorAll(".form"));
  console.log(students.form);
};

getStudents();
