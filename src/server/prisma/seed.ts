import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

const adapter = new PrismaLibSQL(libsql)

const prisma = new PrismaClient({ adapter })

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@edumedic.ro' },
    update: {},
    create: {
      email: 'alice@edumedic.ro',
      name: 'Alice',
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@edumedic.ro' },
    update: {},
    create: {
      email: 'bob@edumedic.ro',
      name: 'Bob',
    },
  })


  await prisma.question.upsert({
    where: { text: "Organele sunt:" },
    update: {},
    create: {
      text: "Organele sunt:",
      answers: {
        create: [
          { text: "grupari de tesuturi identice;", is_correct: true },
          { text: "grupari de tesuturi diferite;", is_correct: false },
          { text: "unitati morfologice ce indeplinesc functia de relatie;", is_correct: false },
          { text: "unitati morfologice ce indeplinesc functia de nutritie;", is_correct: false },
          { text: "unitati morfologice ce indeplinesc functia de reproducere.", is_correct: false },
        ]
      }
    }
  })

  await prisma.question.upsert({
    where: { text: "Alegeti afirmatiile corecte:" },
    update: {
      hint: "Ursu e in camara, unde-i ursu?",
    },
    create: {
      text: "Alegeti afirmatiile corecte:",
      hint: "Ursu e in camara, unde-i ursu?",
      answers: {
        create: [
          { text: "tesutul este format dintr-un grup de celule cu structura diferita;", is_correct: false },
          { text: "dintre moleculele importante ale corpului uman fac parte mitocondriile;", is_correct: false },
          { text: "cel mai simplu nivel de organizare structurala este atomul;", is_correct: true },
          { text: "sistemul de organe este format din mai multe organe cu functii complementare;", is_correct: true },
          { text: "in structura unui organ intilnim un singur tip de tesut.", is_correct: false },
        ]
      }
    }
  })

  await prisma.question.upsert({
    where: { text: "Sistemele de organe sunt:" },
    update: {
      hint: "Ursu e in camara, unde-i ursu?",
      details: "Ursii mananca miere, alune si turisti prosti.",
    },
    create: {
      text: "Sistemele de organe sunt:",
      hint: "Ursu e in camara, unde-i ursu?",
      details: "Ursii mananca miere, alune si turisti prosti.",
      answers: {
        create: [
          { text: "formate din organe care indeplinesc functii similare;", is_correct: true },
          { text: "grupari de tesuturi;", is_correct: false },
          { text: "unitati morfologice ce indeplinesc functia de relatie;", is_correct: false },
          { text: "unitati morfologice ce indeplinesc functia de raproducere;", is_correct: false },
          { text: "unitati morfologice ce indeplinesc functia de nutritie.", is_correct: false },
        ]
      }
    }
  })


}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
