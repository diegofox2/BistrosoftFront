import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusPill from '@core/components/StatusPill.vue'

describe('StatusPill.vue', () => {
  describe('label display', () => {
    it('should display Pending label for status 0', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 0 },
      })

      expect(wrapper.text()).toBe('Pending')
    })

    it('should display Paid label for status 1', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 1 },
      })

      expect(wrapper.text()).toBe('Paid')
    })

    it('should display Shipped label for status 2', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 2 },
      })

      expect(wrapper.text()).toBe('Shipped')
    })

    it('should display Delivered label for status 3', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 3 },
      })

      expect(wrapper.text()).toBe('Delivered')
    })

    it('should display Cancelled label for status 4', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 4 },
      })

      expect(wrapper.text()).toBe('Cancelled')
    })

    it('should handle string value "1"', () => {
      const wrapper = mount(StatusPill, {
        props: { value: '1' },
      })

      expect(wrapper.text()).toBe('Paid')
    })

    it('should handle unknown status', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 99 },
      })

      expect(wrapper.text()).toBe('99')
    })
  })

  describe('styling', () => {
    it('should apply amber styling for Pending (0)', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 0 },
      })

      expect(wrapper.classes()).toContain('bg-amber-50')
      expect(wrapper.classes()).toContain('text-amber-700')
      expect(wrapper.classes()).toContain('border-amber-200')
    })

    it('should apply emerald styling for Paid (1)', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 1 },
      })

      expect(wrapper.classes()).toContain('bg-emerald-50')
      expect(wrapper.classes()).toContain('text-emerald-700')
      expect(wrapper.classes()).toContain('border-emerald-200')
    })

    it('should apply sky styling for Shipped (2)', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 2 },
      })

      expect(wrapper.classes()).toContain('bg-sky-50')
      expect(wrapper.classes()).toContain('text-sky-700')
      expect(wrapper.classes()).toContain('border-sky-200')
    })

    it('should apply indigo styling for Delivered (3)', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 3 },
      })

      expect(wrapper.classes()).toContain('bg-indigo-50')
      expect(wrapper.classes()).toContain('text-indigo-700')
      expect(wrapper.classes()).toContain('border-indigo-200')
    })

    it('should apply rose styling for Cancelled (4)', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 4 },
      })

      expect(wrapper.classes()).toContain('bg-rose-50')
      expect(wrapper.classes()).toContain('text-rose-700')
      expect(wrapper.classes()).toContain('border-rose-200')
    })

    it('should apply default amber styling for unknown status', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 99 },
      })

      expect(wrapper.classes()).toContain('bg-amber-50')
      expect(wrapper.classes()).toContain('text-amber-700')
      expect(wrapper.classes()).toContain('border-amber-200')
    })

    it('should always include base pill styling classes', () => {
      const wrapper = mount(StatusPill, {
        props: { value: 1 },
      })

      expect(wrapper.classes()).toContain('inline-flex')
      expect(wrapper.classes()).toContain('items-center')
      expect(wrapper.classes()).toContain('rounded-full')
      expect(wrapper.classes()).toContain('border')
      expect(wrapper.classes()).toContain('px-3')
      expect(wrapper.classes()).toContain('py-1')
      expect(wrapper.classes()).toContain('text-xs')
      expect(wrapper.classes()).toContain('font-semibold')
      expect(wrapper.classes()).toContain('uppercase')
    })
  })

  describe('reactivity', () => {
    it('should update label when value prop changes', async () => {
      const wrapper = mount(StatusPill, {
        props: { value: 0 },
      })

      expect(wrapper.text()).toBe('Pending')

      await wrapper.setProps({ value: 1 })
      expect(wrapper.text()).toBe('Paid')

      await wrapper.setProps({ value: 2 })
      expect(wrapper.text()).toBe('Shipped')
    })

    it('should update styling when value prop changes', async () => {
      const wrapper = mount(StatusPill, {
        props: { value: 0 },
      })

      expect(wrapper.classes()).toContain('bg-amber-50')

      await wrapper.setProps({ value: 1 })
      expect(wrapper.classes()).toContain('bg-emerald-50')
      expect(wrapper.classes()).not.toContain('bg-amber-50')
    })
  })
})
