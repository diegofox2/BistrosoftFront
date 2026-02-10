import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionCard from '@core/components/SectionCard.vue'

describe('SectionCard.vue', () => {
  describe('basic rendering', () => {
    it('should render with title', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Test Title' },
      })

      expect(wrapper.find('h2').text()).toBe('Test Title')
    })

    it('should render with title and subtitle', () => {
      const wrapper = mount(SectionCard, {
        props: {
          title: 'Main Title',
          subtitle: 'This is a subtitle',
        },
      })

      expect(wrapper.find('h2').text()).toBe('Main Title')
      expect(wrapper.find('p.text-sm').text()).toBe('This is a subtitle')
    })

    it('should render with title and badge', () => {
      const wrapper = mount(SectionCard, {
        props: {
          title: 'Card Title',
          badge: 'NEW',
        },
      })

      expect(wrapper.find('h2').text()).toBe('Card Title')
      expect(wrapper.find('.ui-badge').text()).toBe('NEW')
    })

    it('should render with all props', () => {
      const wrapper = mount(SectionCard, {
        props: {
          title: 'Full Card',
          subtitle: 'With all options',
          badge: 'BETA',
        },
      })

      expect(wrapper.find('h2').text()).toBe('Full Card')
      expect(wrapper.find('p.text-sm').text()).toBe('With all options')
      expect(wrapper.find('.ui-badge').text()).toBe('BETA')
    })
  })

  describe('conditional rendering', () => {
    it('should not render subtitle when not provided', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Only Title' },
      })

      expect(wrapper.find('h2').exists()).toBe(true)
      expect(wrapper.find('p.text-sm').exists()).toBe(false)
    })

    it('should not render badge when not provided', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'No Badge' },
      })

      expect(wrapper.find('.ui-badge').exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Card with Content' },
        slots: {
          default: '<p class="test-content">Main content here</p>',
        },
      })

      expect(wrapper.find('.test-content').text()).toBe('Main content here')
    })

    it('should render actions slot content', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Card with Actions' },
        slots: {
          actions: '<button class="test-button">Action Button</button>',
        },
      })

      expect(wrapper.find('.test-button').text()).toBe('Action Button')
    })

    it('should render both slots', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Full Card' },
        slots: {
          default: '<div class="content">Content</div>',
          actions: '<button class="action">Action</button>',
        },
      })

      expect(wrapper.find('.content').text()).toBe('Content')
      expect(wrapper.find('.action').text()).toBe('Action')
    })

    it('should allow complex slot content', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Complex Content' },
        slots: {
          default: `
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          `,
        },
      })

      expect(wrapper.findAll('li')).toHaveLength(3)
      expect(wrapper.findAll('li')[0].text()).toBe('Item 1')
      expect(wrapper.findAll('li')[1].text()).toBe('Item 2')
      expect(wrapper.findAll('li')[2].text()).toBe('Item 3')
    })
  })

  describe('structure', () => {
    it('should have correct base structure', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Test' },
      })

      const section = wrapper.find('section')
      expect(section.exists()).toBe(true)
      expect(section.classes()).toContain('rounded-3xl')
      expect(section.classes()).toContain('border')
      expect(section.classes()).toContain('bg-white/80')
    })

    it('should have header with correct classes', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Test' },
      })

      const header = wrapper.find('div.border-b')
      expect(header.exists()).toBe(true)
      expect(header.classes()).toContain('px-6')
      expect(header.classes()).toContain('py-5')
    })

    it('should have content area with padding', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Test' },
        slots: {
          default: '<span class="marker">Content</span>',
        },
      })

      const contentArea = wrapper.find('.p-6')
      expect(contentArea.exists()).toBe(true)
      expect(contentArea.find('.marker').exists()).toBe(true)
    })
  })

  describe('styling classes', () => {
    it('should apply Tailwind styling classes correctly', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Styled Card' },
      })

      const section = wrapper.find('section')
      expect(section.classes()).toContain('overflow-hidden')
      expect(section.classes()).toContain('shadow-xl')
      expect(section.classes()).toContain('backdrop-blur')
    })

    it('should style title with correct font classes', () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Styled Title' },
      })

      const title = wrapper.find('h2')
      expect(title.classes()).toContain('text-lg')
      expect(title.classes()).toContain('font-display')
      expect(title.classes()).toContain('font-semibold')
      expect(title.classes()).toContain('text-slate-900')
    })
  })

  describe('reactivity', () => {
    it('should update title when prop changes', async () => {
      const wrapper = mount(SectionCard, {
        props: { title: 'Initial Title' },
      })

      expect(wrapper.find('h2').text()).toBe('Initial Title')

      await wrapper.setProps({ title: 'Updated Title' })
      expect(wrapper.find('h2').text()).toBe('Updated Title')
    })

    it('should update subtitle when prop changes', async () => {
      const wrapper = mount(SectionCard, {
        props: {
          title: 'Title',
          subtitle: 'Initial Subtitle',
        },
      })

      expect(wrapper.find('p.text-sm').text()).toBe('Initial Subtitle')

      await wrapper.setProps({ subtitle: 'New Subtitle' })
      expect(wrapper.find('p.text-sm').text()).toBe('New Subtitle')
    })

    it('should show/hide badge when prop changes', async () => {
      const wrapper = mount(SectionCard, {
        props: {
          title: 'Title',
        },
      })

      expect(wrapper.find('.ui-badge').exists()).toBe(false)

      await wrapper.setProps({ badge: 'NEW' })
      expect(wrapper.find('.ui-badge').exists()).toBe(true)
      expect(wrapper.find('.ui-badge').text()).toBe('NEW')
    })
  })
})
