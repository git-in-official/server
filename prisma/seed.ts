import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.titleInspiration.createMany({
    data: [
      { title: '그댈 위한 날씨' },
      { title: '내 마음의 지도' },
      { title: '잊혀진 목소리' },
      { title: '내 마음이 그런 것처럼' },
      { title: '늘 젖어있던 내 방의 벽' },
      { title: '떠내려가는 내 사랑' },
      { title: '많은 사람 중 한 사람' },
      { title: '우린 계속 걸어' },
      { title: '가끔 울어도 괜찮아' },
      { title: '걷고 뛰고 넘어지고' },
    ],
    skipDuplicates: true,
  });

  await prisma.wordInspiration.createMany({
    data: [
      { word: '속삭임' },
      { word: '불꽃' },
      { word: '어머니' },
      { word: '노을' },
      { word: '기억' },
      { word: '무게' },
      { word: '주사위' },
      { word: ' 친구' },
      { word: '이름' },
      { word: '희망' },
    ],
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
