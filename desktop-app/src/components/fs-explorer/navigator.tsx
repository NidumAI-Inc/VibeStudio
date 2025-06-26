import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type props = {
  currentPathArr: string[]
  onRootClick: () => void
  onNavigate: (v: string) => void
}

function Navigator({ currentPathArr, onRootClick, onNavigate }: props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={onRootClick}
            className='text-sm text-foreground cursor-pointer'
          >
            Root
          </BreadcrumbLink>
        </BreadcrumbItem>

        {currentPathArr.map((segment, i) => (
          <Fragment key={i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => onNavigate(segment)}
                className='text-sm text-foreground cursor-pointer'
              >
                {segment}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Navigator
