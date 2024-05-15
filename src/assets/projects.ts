type Project = {
  name: string
  description: string
  technologies: string
  url?: string
  repository?: string
}

const projects: Project[] = [
  {
    name: 'luisguilher.me',
    url: 'https://luisguilher.me',
    description:
      'The personal website, resume, and CV of Luis Guilherme. The website is built using Next.js, a powerful React framework, with TypeScript for static type checking. The site features a unique presentation of code using the Monaco Editor, which is the same editor used in Visual Studio Code.',
    technologies: 'React, TypeScript, NextJS, Styled Components, P5js',
    repository: 'https://github.com/lguibr/luisguilher.me'
  },
  {
    name: 'MimeFlow',
    url: 'https://mimeflow.luisguilher.me',
    description:
      "MimeFlow the pose matching application lets you engage interactively to practice and perfect your poses across various disciplines, from dance to martial arts, and yoga. Powered by cutting-edge technology, it's designed to adapt to your skills, helping you refine your movements with precision.",
    technologies:
      'TensorFlow, Typescript, NextJS, WebGL, P5js, BlazePose, Linear Algebra',
    repository: 'https://github.com/lguibr/mimeflow'
  },
  {
    name: 'CommitAI',
    url: 'https://pypi.org/project/commitai/',
    description:
      'CommitAI is a command-line tool that helps you generate informative and relevant commit messages for your Git repositories using GPT-4 by OpenAI. It analyzes your staged changes, combines it with a high-level explanation provided by you, and creates a commit message based on this information.',
    technologies: 'Python, AI, LLM, GPT, Claude, Git',
    repository: 'https://github.com/lguibr/commitai'
  },
  {
    name: 'Pongo',
    description:
      'This game combines elements of the classic Pong game with the gameplay of breaking brick games. The backend of the game is written in Go and utilizes the Actor Model pattern to handle different game elements, such as player input, game state, paddle movement, and ball movement. The game has zero dependencies.',
    technologies: 'Go, WebSockets',
    repository: 'https://github.com/lguibr/pongo'
  },
  {
    name: 'Terraplain',
    description:
      'A bootstrap to API with automated provisioning of cloud resources in Google Cloud Platform using Terraform CDK in Typescript.',
    technologies: 'Terraform, Google Cloud Platform, Big Query, TypeScript',
    repository: 'https://github.com/lguibr/terraplain'
  }
]

export default projects
