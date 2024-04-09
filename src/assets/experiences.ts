const experiences = [
  {
    Company: 'Paradigm',
    Role: 'Software Engineer Full Time',
    Start_at: 'Apr 2022',
    End_at: 'Apr 2024',
    Description:
      'Developed crypto web applications, preparing technical tasks, enforcing styles, conducting code reviews, and implementing features.',
    Techs:
      'TypeScript, Python, Go, Electron, React.js, Selenium, Playwright, Docker, Django, AWS, Terraform, Kubernetes, Kafka, Redis .'
  },
  {
    Company: 'Trio',
    Role: 'Senior Software Engineer Full Time',
    Start_at: 'Jun 2021',
    End_at: 'Apr 2022',
    Description:
      'Served as a technical leader in NodeJS application projects, overseeing task preparation, cloud resource provisioning, code reviews, and developer guidance.Ensured code style and quality, and worked as a full-stack software engineer.',
    Techs:
      'Typescript, VueJS, NextJS, React, Electron, KoaJS, ExpressJS, GraphQL, Strapi, PostgreSQL, MySQL, Redis, Webpack, Babel, GCP, Google Cloud Functions, Big Query, Terraform'
  },
  {
    Company: 'Trio',
    Role: 'Software Engineer Full Time',
    Start_at: 'May 2020',
    End_at: 'Jun 2021',
    Description:
      'Technical leader in several projects for different clients, acting as technology definer, provisioning resources in the clouds, implementing code, instructing other developers and reviewing and ensuring code.',
    Techs:
      'Typescript, React, Vue, NextJS, Electron, Express, Koa, Strapi, GraphQL, MySQL, PostgreSQL, Redis, GCP Functions, GCP BigQuery, AWS S3, Heroku'
  },
  {
    Company: 'TremTec',
    Role: 'Software Engineer Full Time',
    Start_at: 'Jul 2019',
    End_at: 'May 2020',
    Description: `Full stack developer working on the development of a platform for managing legal documents and their lifecycle. Working on functional and technical definition, implementation and provision in the cloud for features.`,
    Techs: 'Typescript, React, GraphQL, Docker'
  },
  {
    Company: 'netLex',
    Role: 'Software Engineer Full Time',
    Start_at: 'Jul 2018',
    End_at: 'May 2019',
    Description: `Front-end developer working on several parallel projects for different clients. Acting in communication with the customer's PO, functional and technical definition of solutions and implementing code.`,
    Techs:
      'Javascript, PHP, Python, Docker, AWS EC2, AWS S3, MySQL, Laravel, Flask, AngularJS'
  },
  {
    Company: 'Editora Ecológica',
    Role: 'IT auxiliary Full Time',
    Start_at: 'May 2008',
    End_at: 'Dec 2010',
    Description: `Responsible for maintaining the publisher's virtual store, making advertising pieces published on the website or sent in batches by email.`,
    Techs: 'Javascript, PHP, JQuery, HTML, CSS, FTP'
  }
]
const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = endDate === 'Present' ? new Date() : new Date(endDate)

  const diffInMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() + 1 - start.getMonth())

  const years = Math.floor(diffInMonths / 12)
  const months = diffInMonths % 12

  let duration = ''
  if (years > 0) {
    duration += `${years} yr${years > 1 ? 's' : ''} `
  }
  if (months > 0) {
    duration += `${months} mo${months > 1 ? 's' : ''}`
  }

  return duration.trim()
}

export default experiences.map(experience => {
  return {
    ...experience,
    Duration: calculateDuration(experience.Start_at, experience.End_at)
  }
})
