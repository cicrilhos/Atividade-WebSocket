class UserController {
  async login(req, res) {
    try {
      const {name} = req.body;
      console.log("name:", req.body);

      return res.status(200).json({
        message: 'Login executado com sucesso',
        user: { name }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}



export default new UserController();
