import { useState } from 'react';
import { AppShell } from '@astryxdesign/core/AppShell';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { Layout, LayoutContent, LayoutFooter, Section } from '@astryxdesign/core/Layout';
import { Stack } from '@astryxdesign/core/Stack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { TextArea } from '@astryxdesign/core/TextArea';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import { Link } from '@astryxdesign/core/Link';
import { NavIcon } from '@astryxdesign/core/NavIcon';

function Navigation() {
  return (
    <TopNav
      label="메인 네비게이션"
      heading={
        <TopNavHeading
          logo={<NavIcon icon="rocket" />}
          heading="NextRun"
          headingHref="/"
        />
      }
      startContent={
        <>
          <TopNavItem label="회사 소개" href="#company" isSelected />
          <TopNavItem label="제품" href="#products" />
          <TopNavItem label="Contact Us" href="#contact" />
        </>
      }
      endContent={
        <Button label="문의하기" variant="primary" size="sm" />
      }
    />
  );
}

function CompanyIntro() {
  return (
    <Section id="company" variant="muted" style={{ padding: 'var(--spacing-10) 0' }}>
      <Stack gap={6} hAlign="center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Heading level={2} type="display-2" justify="center">
          NextRun을 소개합니다
        </Heading>
        <Text type="body" size="lg" color="secondary" justify="center" style={{ lineHeight: '1.8' }}>
          NextRun은 혁신적인 기술로 더 나은 미래를 만들어가는 IT 기업입니다.
          인공지능, 클라우드, 데이터 분석 분야에서 쌓아온 전문성을 바탕으로
          고객의 비즈니스 성공을 돕는 최적의 솔루션을 제공합니다.
        </Text>
        <Stack gap={4} wrap="wrap" hAlign="center">
          <Button label="자세히 보기" variant="primary" size="lg" />
          <Button label="파트너십 문의" variant="ghost" size="lg" />
        </Stack>
      </Stack>
    </Section>
  );
}

function Products() {
  const products = [
    {
      name: 'NextAI Platform',
      description: '기업 맞춤형 AI 모델 개발 및 배포 플랫폼. 데이터 준비부터 모델 서빙까지 전 과정을 지원합니다.',
      icon: 'wrench',
      features: ['AutoML 지원', '실시간 추론', '모델 버전 관리', 'A/B 테스팅'],
    },
    {
      name: 'NextCloud Suite',
      description: '멀티 클라우드 환경 통합 관리 솔루션. 비용 최적화와 보안 컴플라이언스를 동시에 해결합니다.',
      icon: 'cloud',
      features: ['비용 분석 대시보드', '자동 스케일링', '보안 정책 관리', '멀티 클라우드 지원'],
    },
    {
      name: 'NextData Analytics',
      description: '실시간 데이터 스트리밍 및 분석 플랫폼. 비즈니스 인사이트를 즉시 도출합니다.',
      icon: 'chart-bar',
      features: ['실시간 대시보드', '자연어 쿼리', '자동 리포팅', '알림 시스템'],
    },
  ];

  return (
    <Section id="products" style={{ padding: 'var(--spacing-10) 0' }}>
      <Stack gap={6} hAlign="center" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-4)' }}>
        <Heading level={2} type="display-2" justify="center">
          우리의 제품
        </Heading>
        <Text type="body" color="secondary" justify="center" style={{ maxWidth: '600px', lineHeight: '1.7' }}>
          기업의 디지털 트랜스포메이션을 가속화하는 세 가지 핵심 제품군
        </Text>
        <Grid columns={3} gap={6} style={{ width: '100%' }}>
          {products.map((product, index) => (
            <Card key={index} variant="default" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack gap={4} padding={6}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: 'var(--radius-lg)', 
                  background: 'var(--accent-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon icon={product.icon as any} size="lg" color="accent" />
                </div>
                <Heading level={3}>
                  {product.name}
                </Heading>
                <Text type="body" color="secondary" style={{ lineHeight: '1.7', flex: 1 }}>
                  {product.description}
                </Text>
                <Divider />
                <Stack gap={2}>
                  {product.features.map((feature, i) => (
                    <Text key={i} type="label" size="sm" color="secondary">
                      <Icon icon="check" size="xsm" style={{ marginRight: 'var(--spacing-2)' }} color="success" />
                      {feature}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}

function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Section id="contact" variant="muted" style={{ padding: 'var(--spacing-10) 0' }}>
      <Stack gap={6} hAlign="center" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--spacing-4)' }}>
        <Heading level={2} type="display-2" justify="center">
          Contact Us
        </Heading>
        <Text type="body" color="secondary" justify="center" style={{ lineHeight: '1.7' }}>
          궁금한 점이 있으신가요? 언제든 문의해 주세요. 빠르게 답변드리겠습니다.
        </Text>
        <Card variant="default" style={{ width: '100%', padding: 'var(--spacing-6)' }}>
          <Stack gap={4}>
            <TextInput
              label="이름"
              value={name}
              onChange={setName}
              placeholder="홍길동"
              isRequired
              width="100%"
            />
            <TextInput
              label="이메일"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="hong@nextrun.com"
              isRequired
              width="100%"
            />
            <TextInput
              label="회사명"
              value={company}
              onChange={setCompany}
              placeholder="NextRun Inc."
              isRequired
              width="100%"
            />
            <TextArea
              label="문의 내용"
              value={message}
              onChange={setMessage}
              placeholder="문의하실 내용을 적어주세요."
              rows={4}
              isRequired
              width="100%"
            />
            <Button label="문의 제출하기" variant="primary" size="lg" width="100%" style={{ marginTop: 'var(--spacing-2)' }} />
          </Stack>
        </Card>
        <Divider />
        <Stack gap={2} hAlign="center">
          <Text type="label" color="secondary">또는 직접 연락주세요</Text>
          <Stack gap={6} hAlign="center" wrap="wrap">
            <Link href="mailto:contact@nextrun.com" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Icon icon="calendar" size="sm" />
              contact@nextrun.com
            </Link>
            <Link href="tel:+82-2-1234-5678" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Icon icon="clock" size="sm" />
              +82-2-1234-5678
            </Link>
            <Link href="https://nextrun.com" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Icon icon="externalLink" size="sm" />
              nextrun.com
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <LayoutFooter style={{ padding: 'var(--spacing-6) var(--spacing-4)', borderTop: '1px solid var(--border)' }}>
      <Stack gap={4} hAlign="center" justify="between" wrap="wrap" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Stack gap={2} hAlign="center">
          <Stack gap={2} hAlign="center">
            <NavIcon icon="rocket" />
            <Text type="body" weight="bold" size="lg">NextRun</Text>
          </Stack>
          <Text type="supporting" color="secondary">
            혁신적인 기술로 더 나은 미래를 만듭니다.
          </Text>
        </Stack>
        <Stack gap={4} hAlign="center" wrap="wrap">
          <Link href="#company" style={{ color: 'var(--color-text-secondary)' }}>회사 소개</Link>
          <Link href="#products" style={{ color: 'var(--color-text-secondary)' }}>제품</Link>
          <Link href="#contact" style={{ color: 'var(--color-text-secondary)' }}>Contact Us</Link>
          <Link href="/privacy" style={{ color: 'var(--color-text-secondary)' }}>개인정보처리방침</Link>
          <Link href="/terms" style={{ color: 'var(--color-text-secondary)' }}>이용약관</Link>
        </Stack>
        <Text type="supporting" color="disabled">
          © {currentYear} NextRun Inc. All rights reserved.
        </Text>
      </Stack>
    </LayoutFooter>
  );
}

export default function App() {
  return (
    <AppShell
      height="auto"
      variant="elevated"
      contentPadding={0}
      topNav={<Navigation />}
    >
      <Layout>
        <LayoutContent>
          <CompanyIntro />
          <Products />
          <ContactUs />
        </LayoutContent>
        <Footer />
      </Layout>
    </AppShell>
  );
}