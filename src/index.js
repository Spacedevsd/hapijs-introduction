const Hapi = require("@hapi/hapi")
const Joi = require("@hapi/joi")

const schema = Joi.object({
  name: Joi.string().required().min(3),
})

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: "localhost"
  });

  server.route({
    method: "POST",
    path: "/users",
    options: {
      validate: {
        payload: schema,
        failAction: (request, h, error) => {
          return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover()
        }
      }
    },
    handler: (request, h) => {
      return h.response(request.payload)
    }
  })

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
}

init();