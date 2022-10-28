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
  <form action="">
  <label for="">${student.id}</label>
  <input disabled type="text" value="${student.firstName}">
  <input disabled type="text" value="${student.lastName}">
  <input disabled type="text" value="${student.capsule}">
  <input disabled type="text" value="${student.age}">
  <input disabled type="text" value="${student.city}">
  <input disabled type="text" value="${student.gender}">
  <input disabled type="text" value="${student.hobby}">
  <button>edit</button>
  <button>confirm</button>
</form>
    `;
  studentList.innerHTML += studentForm;
};

const creatingATable = function () {
  const arrayfilterd = filterBy(searchInput.value);
  studentList.innerHTML = "";
  arrayfilterd.forEach((student) => {
    drawAStudentData(student);
  });
};

const actions = function (value) {
  searchInput.addEventListener("keyup", creatingATable);
};

getStudents();
actions(searchInput.value);
