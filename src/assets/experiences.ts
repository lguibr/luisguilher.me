const experiences = [
  {
    Company: 'Paradigm',
    Role: 'Software Engineer Full Time',
    Start_at: 'Apr 2022',
    End_at: 'Apr 2024',
    Description: `As a Software Engineer at Paradigm, I spearheaded the development of unified UI interfaces using React, React Native, and Electron. By consolidating single-source code, I enhanced user experience and consistency across platforms, increasing team productivity. I also led the implementation of end-to-end testing for complex web crypto applications using Playwright in Python while tackling backend challenges with Golang.`,
    Techs:
      'TypeScript, Python, Go, Electron, React.js, Selenium, Playwright, Docker, Django, AWS, Terraform, Kubernetes, Kafka, Redis .'
  },
  {
    Company: 'Trio',
    Role: 'Senior Software Engineer Full Time',
    Start_at: 'Jun 2021',
    End_at: 'Apr 2022',
    Description:
      "As a Senior Software Engineer at Trio, I was a technical leader in NodeJS application projects. I was responsible for task preparation, cloud resource provisioning, code reviews, and guiding developers. By ensuring code style and quality, I contributed to successfully delivering large-scale projects for major clients in the brewery and traceability industries. As a full-stack software engineer, I played a critical role in driving these projects' technical direction and implementation.",
    Techs:
      'Typescript, VueJS, NextJS, React, Electron, KoaJS, ExpressJS, GraphQL, Strapi, PostgreSQL, MySQL, Redis, Webpack, Babel, GCP, Google Cloud Functions, Big Query, Terraform'
  },
  {
    Company: 'Trio',
    Role: 'Software Engineer Full Time',
    Start_at: 'May 2020',
    End_at: 'Jun 2021',
    Description:
      "As a Software Engineer at Trio, I acted as a technical leader in multiple projects for various clients. I defined technology stacks, provisioned resources in the cloud, implemented code, instructed other developers, and reviewed code to ensure quality. I also collaborated directly with Trio's clients to align expectations and high-level requirements. My leadership and technical expertise were instrumental in delivering successful projects and maintaining strong client relationships.",
    Techs:
      'Typescript, React, Vue, NextJS, Electron, Express, Koa, Strapi, GraphQL, MySQL, PostgreSQL, Redis, GCP Functions, GCP BigQuery, AWS S3, Heroku'
  },
  {
    Company: 'TremTec',
    Role: 'Software Engineer Full Time',
    Start_at: 'Jul 2019',
    End_at: 'May 2020',
    Description: `As a Software Engineer at TremTec, I have headed the Front-End team and worked on multiple parallel projects for different clients. I collaborated with the clients' Product Owners to define functional and technical solutions and implemented code to bring those solutions to life. My role involved effective communication, problem-solving, and delivering high-quality software solutions meeting clients' requirements.`,
    Techs: 'Typescript, React, GraphQL, Docker'
  },
  {
    Company: 'netLex',
    Role: 'Software Engineer Full Time',
    Start_at: 'Jul 2018',
    End_at: 'May 2019',
    Description: `At netLex, I worked as a Full Stack Developer on the development of a platform for managing legal documents and their lifecycle. I actively participated in the functional and technical definition, implementation, and cloud provisioning of features.`,
    Techs:
      'Javascript, PHP, Python, Docker, AWS EC2, AWS S3, MySQL, Laravel, Flask, AngularJS'
  },
  {
    Company: 'Editora Ecológica',
    Role: 'IT auxiliary Full Time',
    Start_at: 'May 2008',
    End_at: 'Dec 2010',
    Description: `In my role as an IT Auxiliary at Editora Ecológica, I was responsible for maintaining the publisher's virtual store. I created advertising pieces that were published on the website and sent through email campaigns. By leveraging my skills in web technologies, I ensured the smooth operation of the virtual store and effectively promoted the publisher's products.`,
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
