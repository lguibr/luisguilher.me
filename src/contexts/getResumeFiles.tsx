import YAML from 'yaml'
import education from 'src/assets/education'
import experiences from 'src/assets/experiences'
import coverLetter from 'src/assets/coverLetter'
import contacts from 'src/assets/contacts'
import skills from 'src/assets/skills'

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

  const completeResumeText = YAML.stringify({
    'Cover Letter': coverLetter.join(''),
    Contacts: contacts,
    Education: education,
    Experiences: experiences,
    Skills: skills
  })
    .replace(
      /(Education:|Experiences:|Contacts:|- Company:|- School:|Skills:|- Languages:|- Programming Language:|- Development Tools:|- Front-end:|- Back-end:|- Cloud\/Infra:)/g,
      '\n$&'
    )
    .replace(/(Cover Letter:|Contacts:)/g, '$&\n')
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
      path: 'resume/complete-resume.yml',
      name: 'complete-resume.yml',
      content: completeResumeText,
      newContent: completeResumeText
    }
  ]
}
