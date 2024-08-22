import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.inspiration.createMany({
    data: [
      // 제목 글감
      { type: 'TITLE', displayName: '그댈 위한 날씨' },
      { type: 'TITLE', displayName: '내 마음의 지도' },
      { type: 'TITLE', displayName: '잊혀진 목소리' },
      { type: 'TITLE', displayName: '내 마음이 그런 것처럼' },
      { type: 'TITLE', displayName: '늘 젖어있던 내 방의 벽' },
      { type: 'TITLE', displayName: '떠내려가는 내 사랑' },
      { type: 'TITLE', displayName: '많은 사람 중 한 사람' },
      { type: 'TITLE', displayName: '우린 계속 걸어' },
      { type: 'TITLE', displayName: '가끔 울어도 괜찮아' },
      { type: 'TITLE', displayName: '걷고 뛰고 넘어지고' },
      //단어 글감
      { type: 'WORD', displayName: '속삭임' },
      { type: 'WORD', displayName: '불꽃' },
      { type: 'WORD', displayName: '어머니' },
      { type: 'WORD', displayName: '노을' },
      { type: 'WORD', displayName: '기억' },
      { type: 'WORD', displayName: '무게' },
      { type: 'WORD', displayName: '주사위' },
      { type: 'WORD', displayName: '친구' },
      { type: 'WORD', displayName: '이름' },
      { type: 'WORD', displayName: '희망' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
