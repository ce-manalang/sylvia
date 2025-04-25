declare global {
  var mockNextNavigation: {
    useRouter: Mock
    useSearchParams: Mock
    useParams: Mock
    // Additional properties
    mockRouter: Record<string, any>
    mockSearchParams: Record<string, any>
    mockParams: Record<string, any>
  }
}