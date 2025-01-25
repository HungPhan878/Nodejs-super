import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../apis/user.api'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../contexts/app.context'
import { setProfileToLS } from '../../utils/auth'

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const getProfileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })
  const profileData = getProfileQuery.data?.data.result
  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
      setProfileToLS(profileData)
    }
  }, [profileData, setProfile])
  return <div>Profile</div>
}
