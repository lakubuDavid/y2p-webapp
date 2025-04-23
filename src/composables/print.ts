// composables/usePrint.ts
import { ref, nextTick, h, render  } from 'vue'
//@ts-ignore
import PrintPageComponent from '../components/PrintPageComponent.vue'

export function usePrint() {
  const isPrinting = ref(false)

  const printComponent = async (componentRef : any) => {
    console.log(componentRef)
    console.dir(componentRef)
    if (!componentRef) {
      console.error('Invalid component reference')
      return
    }

    isPrinting.value = true
    
    try {
      // Create a new div for the print container
      const printContainer = document.createElement('div')
      printContainer.style.position = 'absolute'
      printContainer.style.left = '0px'
      printContainer.style.top = '0px'
      document.body.appendChild(printContainer)
      
      // Clone the target component and wrap it in PrintPageComponent
      const vnode = h(PrintPageComponent, {}, {
        default: () => h(componentRef.__vnode.type, componentRef.__vnode.props || {})
      })
      
      // Render the combined component to the container
      render(vnode, printContainer)
      
      // Wait for Vue to update the DOM
      await nextTick()
      
      // Print the content
      const previousTitle = document.title
      document.title = 'Print Document'
      
      // Store original styles
      //@ts-ignore
      const originalStyles = Array.from(document.styleSheets)
        .map(styleSheet => styleSheet.ownerNode)
        //@ts-ignore
        .filter(node => node?.tagName === 'STYLE' || node?.tagName === 'LINK')
        .map(node => node?.cloneNode(true))
      
      // Use print media query
      window.print()
      
      // Clean up
      document.title = previousTitle
      render(null, printContainer)
      document.body.removeChild(printContainer)
    } catch (error) {
      console.error('Error during printing:', error)
    } finally {
      isPrinting.value = false
    }
  }

  return {
    isPrinting,
    printComponent
  }
}
