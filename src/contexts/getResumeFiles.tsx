import YAML from 'yaml'
import education from 'src/assets/education'
import experiences from 'src/assets/experiences'
import coverLetter from 'src/assets/coverLetter'
import contacts from 'src/assets/contacts'
import skills from 'src/assets/skills'
import projects from 'src/assets/projects'

export const getResumeData = (): {
  path: string
  name: string
  content: string
  newContent: string
}[] => {
  const coverLetterText = JSON.stringify(coverLetter.join(''), null, 2)
  const skillsText = JSON.stringify(skills, null, 2)
  const educationText = JSON.stringify(education, null, 2)
  const experiencesText = JSON.stringify(experiences, null, 2)
  const contactsText = JSON.stringify(contacts, null, 2)
  const projectsText = JSON.stringify(projects, null, 2)

  const completeResumeText = YAML.stringify({
    'Cover Letter': coverLetter.join(''),
    Contacts: contacts,
    Education: education,
    Experiences: experiences,
    Skills: skills,
    Projects: projects
  })
    .replace(
      /(Projects:|Education:|Experiences:|Contacts:|- Company:|- name:|- title:|- School:|Skills:|- Languages:|- Programming Languages:|- Development Tools:|- Testing\/QA:|- Front-end:|- Back-end:|- Cloud\/Infrastructure:)/g,
      '\n$&'
    )
    .replace(/(Cover Letter:|Contacts:|Projects:)/g, '$&\n')
    .replace(/Cover Letter:/, '$&\n')

  return [
    {
      path: 'resume/cover-letter.json',
      name: 'cover-letter.json',
      content: coverLetterText,
      newContent: coverLetterText
    },
    {
      path: 'resume/education.json',
      name: 'education.json',
      content: educationText,
      newContent: educationText
    },
    {
      path: 'resume/experience.json',
      name: 'experience.json',
      content: experiencesText,
      newContent: experiencesText
    },
    {
      path: 'resume/skills.json',
      name: 'skills.json',
      content: skillsText,
      newContent: skillsText
    },
    {
      path: 'resume/contacts.json',
      name: 'contacts.json',
      content: contactsText,
      newContent: contactsText
    },
    {
      path: 'resume/projects.json',
      name: 'projects.json',
      content: projectsText,
      newContent: projectsText
    },
    {
      path: 'resume/complete-resume.yml',
      name: 'complete-resume.yml',
      content: completeResumeText,
      newContent: completeResumeText
    }
  ]
}
