if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const nodemailer = require('nodemailer')

const PORT = process.env.PORT || 3001
const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.post('/', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `

  const main = async () => {
    let transporter = nodemailer.createTransport({
      host: process.env.NODEMAIL_HOST,
      port: process.env.NODEMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.NODEMAIL_USER,
        pass: process.env.NODEMAIL_PASSWORD
      }
    })

    let info = await transporter.sendMail({
      from: '"Nodemailer" <contact@gmail.com>',
      to: process.env.NODEMAIL_USER,
      subject: 'Contact Request',
      text: '',
      html: output
    })

    console.log('Message sent: %s', info.messageId)

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }
  main()
    .then(() => {
      res.json({ message: 'Succesfully sent email!' })
    })
    .catch((err) => {
      console.error(err)
      res.json({ message: 'Unsuccesful in sending email!' })
    })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
