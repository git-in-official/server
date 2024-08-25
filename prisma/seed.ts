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
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
