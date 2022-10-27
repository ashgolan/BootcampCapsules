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
  const arrOfDes = await Promise.all(totalStudentsDesc);
  console.log(arrOfDes);

  creatingAtable(arrOfDes);
  //   console.log(sortBy("firstName", arrOfDes));
  //   console.log(filterBy("מירי", arrOfDes));
};

const filterBy = function (property, arr) {
  const resault = arr.filter((student) => student.property === property);
  return resault;
};

const sortBy = function (category, arr) {
  const newArrByCatagory = arr.map((m) => {
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
  const studentList = document.querySelector(".students-list");
  studentList.innerHTML += studentForm;
};

const creatingAtable = function (arr) {
  arr.forEach((student) => {
    drawAStudentData(student);
  });
};

getStudents();
