import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.achievement.createMany({
    data: [
      {
        name: '첫 발자국',
        description: '첫 번째 시를 게시한 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement1.svg',
      },
      {
        name: '목소리의 주인공',
        description: '낭독된 시가 30회 이상 플레이 된 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement2.svg',
      },
      {
        name: '별이 된 시',
        description:
          '작성한 시 중 하나가 독자들에 의해 10회 이상 스크랩 된 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement3.svg',
      },
      {
        name: '매일 그대와',
        description: '10일 연속 접속한 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement4.svg',
      },
      {
        name: '테마 수집가',
        description: '모든 테마 태그를 한번 이상 사용한 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement5.svg',
      },
      {
        name: '상호작용 수집가',
        description: '모든 상호작용 태그를 한번 이상 사용한 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement6.svg',
      },
      {
        name: '새벽감성 작가',
        description: '새벽 2시 이후 작성한 시가 50회 이상 스크랩된 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement7.svg',
      },
      {
        name: '들쑥날쑥',
        description: '모든 기분을 한번 이상 선택한 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement8.svg',
      },
      {
        name: '열번 찍어 넘어간 나무',
        description: '시를 10회 이상 스크랩한 경우',
        icon: process.env.AWS_CLOUDFRONT_URL + '/achievement/achievement9.svg',
      },
    ],
    skipDuplicates: true,
  });

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
