import type { IconType } from 'react-icons'
import {
  SiAngular,
  SiCss,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFlask,
  SiGit,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiRedis,
  SiShadcnui,
  SiSocketdotio,
  SiSpringboot,
  SiTailwindcss,
  SiTanstack,
  SiTypescript,
  SiVite,
  SiVuedotjs,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { TbLambda } from 'react-icons/tb'
import { Icon, toolIcon } from './Icon'

// Brand logos for specific technologies (react-icons, mostly the Simple
// Icons set), with each brand's colour. Order matters: the first match wins,
// so "NestJS" is checked before "Node.js" and "Node.js" before "JavaScript".
const TECH: Array<[RegExp, IconType, string]> = [
  [/nest/i, SiNestjs, '#e0234e'],
  [/node/i, SiNodedotjs, '#5fa04e'],
  [/next\.?js/i, SiNextdotjs, '#000000'],
  [/express/i, SiExpress, '#000000'],
  [/typescript|\bts\b/i, SiTypescript, '#3178c6'],
  [/javascript|\bjs\b/i, SiJavascript, '#f7df1e'],
  [/tanstack/i, SiTanstack, '#ff4154'],
  [/react/i, SiReact, '#61dafb'],
  [/angular/i, SiAngular, '#dd0031'],
  [/vue/i, SiVuedotjs, '#4fc08d'],
  [/shadcn/i, SiShadcnui, '#000000'],
  [/tailwind/i, SiTailwindcss, '#06b6d4'],
  [/python/i, SiPython, '#3776ab'],
  [/flask/i, SiFlask, '#000000'],
  [/spring/i, SiSpringboot, '#6db33f'],
  [/\bjava\b/i, FaJava, '#e76f00'],
  [/lambda/i, TbLambda, '#ff9900'],
  [/rabbit/i, SiRabbitmq, '#ff6600'],
  [/socket/i, SiSocketdotio, '#010101'],
  [/postgres/i, SiPostgresql, '#4169e1'],
  [/mysql/i, SiMysql, '#4479a1'],
  [/mongo/i, SiMongodb, '#47a248'],
  [/redis/i, SiRedis, '#ff4438'],
  [/graphql/i, SiGraphql, '#e10098'],
  [/docker/i, SiDocker, '#2496ed'],
  [/kubernetes/i, SiKubernetes, '#326ce5'],
  [/\bgit\b/i, SiGit, '#f05032'],
  [/html/i, SiHtml5, '#e34f26'],
  [/\bcss\b/i, SiCss, '#663399'],
  [/figma/i, SiFigma, '#f24e1e'],
  [/linux/i, SiLinux, '#fcc624'],
  [/vite/i, SiVite, '#646cff'],
  [/jest/i, SiJest, '#c21325'],
]

export const techLogo = (name: string) => TECH.find(([re]) => re.test(name))

/** Brand colour for a technology, or undefined for general skills. */
export const techColor = (name: string) => techLogo(name)?.[2]

// Brand logo for a technology; general skills ("Software Design",
// "REST APIs"...) fall back to a matching Hugeicons icon.
export function TechIcon({
  name,
  size = 16,
  className = '',
  variant,
}: {
  name: string
  size?: number
  className?: string
  variant?: 'line' | 'solid' | 'swap'
}) {
  const hit = techLogo(name)
  if (hit) {
    const Logo = hit[1]
    return <Logo size={size} className={`icon tech-icon ${className}`} aria-hidden="true" />
  }
  return <Icon name={toolIcon(name)} size={size} className={className} variant={variant} />
}
