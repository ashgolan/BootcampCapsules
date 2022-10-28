const searchInput = document.querySelector(".search");
const selectedValue = document.getElementById("selectByCategory");
const studentList = document.querySelector(".students-list");
const students = {
  alldata: [],
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

  creatingATable(students.alldata);
  //   console.log(sortBy("firstName", arrOfDes));
  //   console.log(filterBy("מירי", arrOfDes));
};

const filterBy = function (property) {
  if (property === "") return students.alldata;
  return students.alldata.filter((student) =>
    `${student[selectedValue.value]}`.includes(property)
  );
};

const sortBy = function (category) {
  const newArrByCatagory = students.alldata.map((m) => {
    return m[category];
  });

  return newArrByCatagory.sort();
};

const drawAStudentData = function (student) {
  const studentForm = `
  <form class='form' id="${student.id}" action="">
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
</form>
`;
  studentList.innerHTML += studentForm;
};
const sortEvent = function (e) {
  console.log(e.textContent);
};
const creatingTitles = function () {
  const head = `
  <form class="control-form" action="">
  <label class='head id' for="">Id</label>
  <label class='head firstName-head'  type="text" >firstName <span><i class="fa-solid fa-sort"></i></span></label>
  <label class='head lastName-head'  type="text" >lastName <span><i class="fa-solid fa-sort"></i></span></label>
  <label class='head capsuleName-head'  type="text" >Capsule <span><i class="fa-solid fa-sort"></i></span></label>
  <label class='head ageName-head'  type="text" >Age <span><i class="fa-solid fa-sort"></i></span></label>
  <label class='head cityName-head'  type="text" >City <span><i class="fa-solid fa-sort"></i></span></label>
  <label class='head genderName-head'  type="text" >Gender <span><i class="fa-solid fa-sort"></i></span></label>
  <label class='head hobbyName-head'  type="text" >Hobby <span><i class="fa-solid fa-sort"></i></span></label>
  <button class='btn-head edit-btn'></button>
  <button class='btn-head remove-btn'></button>
</form>
    `;
  studentList.innerHTML = head;
  const headers = document.querySelectorAll(".head");
  console.log(headers);
  for (let head of headers) {
    head.addEventListener("click", function (e) {
      console.log(e.textContent);
    });
  }
};

const creatingATable = function () {
  studentList.innerHTML = "";
  creatingTitles();
  const arrayfilterd = filterBy(searchInput.value);
  arrayfilterd.forEach((student) => {
    drawAStudentData(student);
  });
};

const actions = function (value) {
  searchInput.addEventListener("keyup", creatingATable);
};

getStudents();
actions(searchInput.value);
