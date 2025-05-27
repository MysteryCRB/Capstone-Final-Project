import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('1234567890', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'wardenx.business@gmail.com' },
    update: {},
    create: {
      email: 'wardenx.business@gmail.com',
      password: hashedPassword,
      role: 'ADMIN'
    },
  })

  console.log('Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 