function status(request, response) {
  response.status(200).json({ msg: "Tudo certo" });
}

export default status;
